# FloorTiles

FloorTiles is a jQuery plugin for layout of the block elements (div, li, img, etc.) with integer (multiple) sizes without holes.

You only need to specify the dimensions of the blocks in the "axb" format in the data-tile attribute of the block elements.

#Usage

```html    
<div class="floor">
	<div data-tile="2x1"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x1"></div>
	<div data-tile="2x1"></div>
</div>
...
<script src="floortiles.min.js" type="text/javascript"></script>
<script type="text/javascript">
	$.noConflict();
	jQuery(document).ready(function($) {
		$('.floor').floortiles({
			tileSize: '200x150'
		});
	})
</script>
```

#Settings

- `tileSize`: maximum size (in px) of tiles,
- `tileLimit`: maximum size (in units 1x1) of tiles,
- `maxWidth`: maximum width (in px) of window for tiles,
- `gap`: gap (in px) between of tiles,
- `minCol`: minimum number of columns,
- `animate`: (boolean),
- `animateTime`: (in ms),
- `delayResizeTime`: (in ms),
- `tiled`: callback function (el, ui) - triggered when a tile is sited on your place:
  - el: a tile (jQuery-node),
  - ui: object {index: (from 0), tile: {x, y}, pos: {x, y}, size: {x, y}}.
  - Code examples:
  - Initialize the FloorTiles with the create callback specified:

```js    
$('.floor').floortiles({
	tiled: function (el, ui) {
		el.html(ui.index + 1).wrapInner('<div />');
	}
});
```

#[Demo](https://tontsacom.github.io/floortiles/)
