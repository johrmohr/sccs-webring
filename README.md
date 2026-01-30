# LPN Webring

A [webring](https://en.wikipedia.org/wiki/Webring) for ICS students in Lambda Phi at the University of California, Irvine. A webring links personal websites in a circular way, letting visitors discover new people by navigating through the ring.

## How to Join

1. **Add the widget to your site** (see below)
2. **Fork this repository**
3. **Add your info** to the `siteData` array in `data.js`
4. **Submit a pull request**

### Widget Code

Add this to your site's footer:

```html
<div class="webring">
  <a href="https://webring.lpnuci.com/#YOUR-SITE?nav=prev">&larr;</a>
  <a href="https://webring.lpnuci.com/">webring</a>
  <a href="https://webring.lpnuci.com/#YOUR-SITE?nav=next">&rarr;</a>
</div>
```

Replace `YOUR-SITE` with your site's URL (without `https://`)

## Credits
Inspired by the [SYDE-BME](https://cs.uwatering.com/) webring from Waterloo!

Developed by [Jordan](https://github.com/johrmohr)