<p align="center">
  <img src="readme-logo.png" height="150">
</p>

# LPN Webring

A [webring](https://en.wikipedia.org/wiki/Webring) for students and alumni from Lambda Phi Nu at the University of California, Irvine. A webring links personal websites in a circular way, letting visitors discover new people by navigating through the ring.

**[Visit the webring →](https://webring.lpnuci.com/)**

## How to Join

1. **Add the widget to your site** (see below)
2. **Fork this repository**
3. **Add your info** to the `siteData` array in `data.js`
4. **Submit a pull request**

## Widget Template

Add this to your site's footer:

```html
<div style="display: flex; align-items: center; gap: 12px;">
  <a href="https://webring.lpnuci.com/?nav=prev&from=YOUR-SITE">&larr;</a>
  <a href="https://webring.lpnuci.com/">
    <img src="https://webring.lpnuci.com/widget-icon.png" height="24" alt="LPN Webring">
  </a>
  <a href="https://webring.lpnuci.com/?nav=next&from=YOUR-SITE">&rarr;</a>
</div>
```

Replace `YOUR-SITE` with your site's URL (without `https://`).

<p align="center">
  <img src="widget-icon.png" height="50">
</p>

## Credits

Inspired by the [SYDE-BME Webring](https://sydeb.me/) from Waterloo

Developed by [Jordan](https://github.com/johrmohr)
