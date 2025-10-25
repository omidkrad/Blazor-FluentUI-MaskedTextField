namespace FluentMaskedTextField.Pages.Samples;

public partial class MaskedTextFieldDemo
{
    // Advanced mask options (IMask.js format) - C# 11 raw string literals with proper JSON formatting

    private String CurrencyMaskOptions => """
    {
      "mask": "$num",
      "blocks": {
        "num": {
          "mask": "Number",
          "thousandsSeparator": ","
        }
      }
    }
""";

    private String FlexiblePhoneMaskOptions => """
    {
      "mask": "(000) 000-0000",
      "lazy": false
    }
""";

    private String LazyMaskOptions => """
    {
      "mask": "0000 0000 0000 0000",
      "lazy": true
    }
""";

    // RegEx needs to be in a string format and start with a forward slash (/)
    private String RegexMaskOptions => """
    {
      "mask": "/^[a-zA-Z0-9]*$/"
    }
""";
}
