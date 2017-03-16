# Aerial

Aerial is a single page, single screen responsive site template. It is a port of [HTML5 UP's Aerial theme](https://html5up.net/aerial).

![Aerial Theme screenshot](https://raw.githubusercontent.com/sethmacleod/aerial/master/images/screenshot.png)

## Installation

Run the following commands inside the folder of your Hugo site:

	$ cd themes
	$ git clone https://github.com/sethmacleod/aerial.git

## Getting Started

After installation, you only need to configure the config.toml file and, if desired, change the background picture.

### The config file

Copy the config.toml file from the exampleSite folder into your root folder of your Hugo site. Change the fields as needed. Be sure to change the baseurl. Add or delete social media as needed. You may need to look up the [font-awesome](http://fontawesome.io/) icon names. The icon field should be filled out without the "fa" prefix. The icon field for Twitter should be `twitter` instead of `fa-twitter`.

### Change the background

Should you choose to change the background, create a `/static/css/images` folder and add a picture named `bg.jpg`. For the best results, follow these instructions:

The Scrolling Background:

    This relies entirely on CSS to do its thing, which is cool, but that makes
    changing it a bit weird/tricky at first. You can still use pretty much any image
    you want, but for best results make sure yours is:

    - Horizontally tileable.
    - Wide and short.
    - About 1500px wide.
    - Fades to a solid color either at the top of bottom (which is used to fill
      the empty space above or below your image).

    Now, there are two ways to use it: with CSS, or with Sass:

    CSS:

        Look for this line in css/style.css (line 108 as of this writing):

            background: #348cb2 url("images/bg.jpg") bottom left;

        and use it to set the page background color, URL, and placement of
        your image. It should be as close to 1500px wide as you can get it.

    Sass:

        Set the value of $bg to the page background color, URL, and placement
        of your image. Change $bg-width if your image is something other than
        1500px wide.

### Add custom js snippets

Should you choose to add custom js snippet, create a `layouts/partials` folder with `js.html` file and put your js code in this file.

This can be useful for adding [Google Analytics](https://gohugo.io/extras/analytics/). Just add `{{ template "_internal/google_analytics.html" . }}` to the file and configure the config file with your `googleAnalytics` tracking id.

## Customize favicon.ico

You can customize a `favicon.ico` by adding it to `static` folder.

## License

This theme is released under the CC BY 3.0 license. For more information, read the [License](https://github.com/sethmacleod/aerial/blob/master/LICENSE.md).
