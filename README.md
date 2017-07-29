# FloorTiles

FloorTiles is an lightweight jQuery plug-in for native layout inside a rectangular area of ​​tiles - block elements (div, li, img, etc.) with integer sizes - without voids.

You only need to specify the dimensions of each tile in the "AxB" format. The plug-in will place your tiles, maximally respecting their original order.

The intended application area of ​​the plug-in is the compact placement of preview images of user materials that have different visual formats on the screen, similar to placing a mosaic tile on the floor. In this case, a structured joint between the tiles is formed, arranged along a rectangular lattice. The size of the seam and the dimensions of the grate are controlled by the user through the options-options of the plug-in.

Look at [DEMO](https://tontsacom.github.io/floortiles/) to illustrate how the plugin works.

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

# Плагин FloorTiles

FloorTiles это "легкий" jQuery-плагин для нативной раскладки внутри прямоугольной области плиток - блочных элементов (div, li, img и т.п.) с целочисленными размерами - без образования пустот.

Вам необходимо только определить размеры каждой плитки в формате «AxB». Плагин разместит ваши плитки, максимально соблюдая их первоначальный порядок.

Предполагаемая область применения плагина – компактное размещение "превью"-изображений пользовательских материалов, имеющих различные визуальные форматы, на экране подобно размещению мозаичной плитки на полу. При этом формируется структурированный шов между плитками, располагающийся по прямоугольной решётке. Размер шва и размеры решетки контролируются пользователем через параметры-опции плагина.

Посмотрите [ДЕМО](https://tontsacom.github.io/floortiles/) для иллюстрации работы плагина.

# Как установить плагин:

Для установки плагина скачайте из репозитария файл скрипта и поместите в тело своего HTML следующие конструкции:
1.	В теле `<head>` или в подвале тела `<body>` (согласно вашим предпочтениям) вызов скрипта (после предварительного вызова скрипта jQuery, чьим плагином является floortiles):

```html    
<script src="floortiles.min.js" type="text/javascript"></script>
```
2.	В теле `<body>` в нужном вам месте конструкцию:

```html    
<div class="floor">
	<div data-tile="2x1"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x1"></div>
	<div data-tile="2x1"></div>
</div>
```
3.	Инициализация плагина обеспечивается следующим скриптом, который советуем поместить в самый подвал тела `<body>`:

```html    
<script type="text/javascript">
	$.noConflict();
	jQuery(document).ready(function($) {
		$('.floor').floortiles({
			tileSize: '200x150'
		});
	})
</script>
```

