# FloorTiles

![uk](https://user-images.githubusercontent.com/30435087/28743976-dacfbdbe-7467-11e7-9e5a-6dad3bda90e3.png)

FloorTiles is an lightweight jQuery plug-in for native layout inside a rectangular area of ​​tiles - block elements (div, li, img, etc.) with integer sizes - without voids.

You only need to specify the dimensions of each tile in the "AxB" format. The plug-in will place your tiles, maximally respecting their original order.

The intended application area of ​​the plug-in is the compact placement of preview images of user materials that have different visual formats on the screen, similar to placing a mosaic tile on the floor. In this case, a structured joint between the tiles is formed, arranged along a rectangular lattice. The size of the seam and the dimensions of the grate are controlled by the user through the options-options of the plug-in.

Look at [DEMO](https://tontsacom.github.io/floortiles/) to illustrate how the plugin works.

![ru](https://user-images.githubusercontent.com/30435087/28743977-dacff6ee-7467-11e7-8bc1-a3d07801823c.png)

FloorTiles это "легкий" jQuery-плагин для нативной раскладки внутри прямоугольной области плиток - блочных элементов (div, li, img и т.п.) с целочисленными размерами - без образования пустот.

Вам необходимо только определить размеры каждой плитки в формате «AxB». Плагин разместит ваши плитки, максимально соблюдая их первоначальный порядок.

Предполагаемая область применения плагина – компактное размещение "превью"-изображений пользовательских материалов, имеющих различные визуальные форматы, на экране подобно размещению мозаичной плитки на полу. При этом формируется структурированный шов между плитками, располагающийся по прямоугольной решётке. Размер шва и размеры решетки контролируются пользователем через параметры-опции плагина.

Посмотрите [ДЕМО](https://tontsacom.github.io/floortiles/) для иллюстрации работы плагина.

# Usage

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

# Settings

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

<a href="#floortiles">go to top</a>
