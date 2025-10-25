/**
 * IMask.js integration module for Blazor masked input components
 * Provides masking functionality for text inputs using IMask library from CDN
 *
 * IMask.js docs: https://imask.js.org/guide.html
 * Uses ES module imports via CDN (unpkg)
 */

// Store active mask instances for cleanup
const activeMasks = new Map();

// Cache the IMask module after first load
let imaskModule = null;
let imaskLoadPromise = null;

/**
 * Predefined mask patterns for common use cases
 */
const MaskPatterns = {
    // Phone number: +1 (999) 999-9999
    phoneNumber: '+1 (000) 000-0000',

    // Social Security Number: 999-99-9999
    ssn: '000-00-0000',

    // Credit Card: 9999 9999 9999 9999
    creditCard: '0000 0000 0000 0000',

    // Date: MM/DD/YYYY
    date: '00/00/0000',

    // ZIP Code: 99999
    zipCode: '00000',

    // ZIP+4: 99999-9999
    zipCodePlus4: '00000-0000',

    // Time: HH:MM
    time: '00:00',

    // Time with seconds: HH:MM:SS
    timeWithSeconds: '00:00:00',

    // IP Address: 999.999.999.999
    ipAddress: '000.000.000.000',

    // Currency: $999,999.99
    currency: '$0,000.00'
};

/**
 * Loads the IMask library from CDN
 * Uses unpkg CDN which provides ESM distribution by default
 * @returns {Promise<Object>} IMask module with default export
 */
async function loadIMask() {
    // Return cached promise if already loading/loaded
    if (imaskLoadPromise) {
        return imaskLoadPromise;
    }

    imaskLoadPromise = (async () => {
        if (imaskModule) {
            return imaskModule;
        }

        try {
            // Use unpkg CDN for ESM module - modern and standards-based
            // unpkg automatically serves the package.json "module" field (ESM)
            imaskModule = await import('https://unpkg.com/imask?module');
            console.log('IMask.js loaded successfully from unpkg CDN');
            return imaskModule;
        } catch (error) {
            console.error('Failed to load IMask from unpkg:', error);
            throw new Error('Could not load IMask module from unpkg CDN');
        }
    })();

    return imaskLoadPromise;
}

/**
 * Initializes an IMask instance on the given element
 * @param {HTMLElement} element - The input element to mask
 * @param {string|object} maskOptions - Named pattern (e.g., "phone"), mask pattern, or options object
 * @returns {Promise<Object>} Mask instance wrapper with methods for manipulation
 */
export async function initMask(element, maskOptions) {
    try {
        // Load IMask module
        const IMaskModule = await loadIMask();
        const IMask = IMaskModule.default;

        // Parse maskOptions if it's a JSON string
        let options;
        if (typeof maskOptions === 'string') {
            // First check if it's a named pattern
            if (MaskPatterns.hasOwnProperty(maskOptions)) {
                return MaskPatterns[maskOptions];
            }

            // Try to parse as JSON (for complex options)
            try {
                options = JSON.parse(maskOptions);
            } catch {
                // If not valid JSON, treat as a simple mask pattern
                options = { mask: maskOptions };
            }
        } else {
            // Already an object
            options = maskOptions;
        }

        // Ensure we have a mask option
        if (!options.mask && typeof options === 'string') {
            options = { mask: options };
        }

        // Process mask options to convert string types to JavaScript types
        options = processMaskOptions(options);

        // Create mask instance
        const maskInstance = IMask(element, options);

        // Store the instance for later cleanup
        const instanceId = generateInstanceId();
        activeMasks.set(instanceId, maskInstance);

        // Return an object with destroy method for cleanup
        return {
            destroy: function () {
                maskInstance.destroy();
                activeMasks.delete(instanceId);
            },
            getValue: function () {
                return maskInstance.value;
            },
            setValue: function (value) {
                maskInstance.value = value;
            },
            getUnmaskedValue: function () {
                return maskInstance.unmaskedValue;
            }
        };
    } catch (error) {
        console.error('Failed to initialize mask:', error);
        throw new Error(`Mask initialization failed: ${error.message}`);
    }
}

/**
 * Recursively processes mask options to convert string representations
 * of RegEx, Number, and Date types into their JavaScript equivalents
 * @param {Object} options - The mask options object
 * @returns {Object} Processed options with proper types
 */
function processMaskOptions(options) {
    if (typeof options !== 'object' || options === null) {
        return options;
    }

    const processed = Array.isArray(options) ? [...options] : { ...options };

    for (const key in processed) {
        if (Object.prototype.hasOwnProperty.call(processed, key)) {
            const value = processed[key];

            // Handle the "mask" property specially
            if (key === 'mask' && typeof value === 'string') {
                processed[key] = parseMaskValue(value);
            }
            // Recursively process nested objects (like "blocks")
            else if (typeof value === 'object' && value !== null) {
                processed[key] = processMaskOptions(value);
            }
        }
    }

    return processed;
}

/**
 * Parses a mask value string into its appropriate JavaScript type
 * Handles RegEx patterns, Number type, and Date type
 * @param {string} maskValue - The mask value to parse
 * @returns {RegExp|string|Object} Parsed mask value
 */
function parseMaskValue(maskValue) {
    if (typeof maskValue !== 'string') {
        return maskValue;
    }

    // Check if it's a RegEx pattern (starts and ends with /)
    if (maskValue.startsWith('/') && maskValue.includes('/')) {
        try {
            // Extract regex pattern and flags
            const lastSlashIndex = maskValue.lastIndexOf('/');
            const pattern = maskValue.substring(1, lastSlashIndex);
            const flags = maskValue.substring(lastSlashIndex + 1);
            return new RegExp(pattern, flags);
        } catch (error) {
            console.warn(`Failed to parse RegEx pattern "${maskValue}":`, error);
            return maskValue;
        }
    }

    // Check for specific mask types https://imask.js.org/guide.html#masked
    if (maskValue === 'Number') {
        return Number;
    }
    if (maskValue === 'Date') {
        return Date;
    }
    if (maskValue === 'IMask.MaskedRange') {
        return IMask.MaskedRange;
    }
    if (maskValue === 'IMask.MaskedEnum') {
        return IMask.MaskedEnum;
    }

    return maskValue;
}

/**
 * Destroy all active mask instances (cleanup)
 * Safe cleanup for all registered mask instances
 */
export function destroyAllMasks() {
    activeMasks.forEach((mask) => {
        try {
            mask.destroy();
        } catch (error) {
            console.warn('Error destroying mask:', error);
        }
    });
    activeMasks.clear();
}

/**
 * Generate a unique instance ID
 * @returns {string} Unique ID based on timestamp and random string
 */
function generateInstanceId() {
    return `mask_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    destroyAllMasks();
});
