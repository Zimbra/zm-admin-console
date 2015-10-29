Installation
-------------------

    brew install phantomjs
    sudo npm install phantom-jasmine -g


Loading source files
--------------------

By default phantom-jasmine will look for a yaml file in `spec/load.yml`. Use this to list all the scripts you want to load before your specs. e.g.

    ---
      - 'lib/jquery.js'
      - 'app/**/*.js'

If you want to put this file elsewhere use the `--config` flag, e.g.

    phantom-jasmine --config tests/config.yml


Running Tests
-------------------

    phantom-jasmine

Or run specific specs

    phantom-jasmine spec/path/my_spec.js
    phantom-jasmine spec/path/

If everything works you should see output like this in your terminal:

    Util : should fail for the example
    Error: Expected false to be truthy.

    Finished
    -----------------
    3 specs, 1 failure in 0.024s.
