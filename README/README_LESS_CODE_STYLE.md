# LESS Code style notes

## Architecture
```
  public/
        |
         less/ => Public LESS directory
         |     |
         |     _app.mixins.less
         |     _app.override.less
         |     _app.variables.less
         |     app.main.less => Aggregate all LESS modules compiles to ./css/app.css
         |
         css/
         |   |
         |   app.css
         |
         modules/
                |
                [module]
                       |
                       less
                          |
                          [less_module]
                          |           |
                          |           [module_name].[less_module_name].less|
                          |
                          [module-name].less => Agrgregate less modules
```


## Common
```
  .slots-table { max-height: 300px; }

  .slot-opacity { opacity: .5; }

  .info-msg { margin-top: 30%; }

  .overdue-badge {
    background: transparent;
    color: @base-color;
    border: 1px solid @base-color;
    border-radius: 50%;
    cursor: pointer;
    transition: all .5s;

    &:hover {
      background: @base-color;
      color: #FFF;
    }
  }

```

Pay attention on:
- single rule selector put in one line.
- cascade selectors if it possible
- last line of file should be empty
- after each cascade should be empty line except first
- use mixins if it possible
- use variables
- use shortcuts
- use HEX in uppercase
- use ```em, rm``` units if it possible
- use ```.1(em)``` instead of ```0(em)```
- don't use ```!important```, only in cases where no any other variants
- use media with ```screen```
- sort rules in order:
```
  .selector {
    /* Positioning */
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;

    /* Display & Box Model */
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 10px solid #333;
    margin: 10px;

    /* Color */
    background: #000;
    color: #fff

    /* Text */
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.4;
    text-align: right;

    /* Other */
    cursor: pointer;
  }
```
