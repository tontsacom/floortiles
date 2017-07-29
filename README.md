# FloorTiles
<a href="#Плагин-floortiles">README на русском языке</a>

FloorTiles is an lightweight jQuery plug-in for native layout inside a rectangular area of ​​tiles - block elements (div, li, img, etc.) with integer sizes - without holes.

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



# Плагин FloorTiles
<a href="#floortiles">README in English</a>

FloorTiles это "легкий" jQuery-плагин для нативной раскладки внутри прямоугольной области плиток - блочных элементов (`div`, `li`, `img` и т.п.) с целочисленными размерами - без образования пустот.

Вам необходимо только определить размеры каждой плитки в формате `'AxB'`. Плагин разместит Ваши плитки, максимально соблюдая их первоначальный порядок.

Предлагаемая область применения плагина – компактное размещение "превью"-изображений пользовательских материалов, имеющих различные визуальные форматы, на экране подобно размещению мозаичной плитки на полу. При этом формируется структурированный шов между плитками, располагающийся по прямоугольной решётке. Размер шва и размеры решетки контролируются пользователем через параметры-опции плагина.

Плагин обладает адаптивностью под заданную пользователем (и ограниченную шириной окна браузера) ширину поля для выкладки. Это позволяет использовать его на различных устройствах (и различных ориентациях устройств).

Посмотрите [ДЕМО](https://tontsacom.github.io/floortiles/) для иллюстрации работы плагина.

# Как установить плагин:

Для установки плагина скачайте из репозитария файл скрипта и поместите в тело своего HTML следующие конструкции:
1.	В теле `<head>` или в подвале тела `<body>` (согласно Вашим предпочтениям) вызов скрипта (после предварительного вызова скрипта jQuery, чьим плагином является floortiles):

```html    
<script src="floortiles.min.js" type="text/javascript"></script>
```
2.	В теле `<body>` в нужном Вам месте конструкцию (в качестве имени класса `floor` можете использовать собственное, либо не использовать вовсе):

```html    
<div class="floor">
	<div data-tile="2x1"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x2"></div>
	<div data-tile="1x1"></div>
	<div data-tile="2x1"></div>
</div>
```
3.	Инициализация плагина обеспечивается следующим скриптом, который советуем поместить в самый подвал тела `<body>` (теперь понятно, что имя класса `floor` использовано лишь для идентификации DOM-элемента, в котором будет размещаться результат работы плагина):

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

# Параметры:

- `tileSize`: тип данных - `string` в формате `'AxB'`, максимальный размер (в px-единицах) плитки минимального размера `'1x1'`, величина параметра по умолчанию - `'200x150'`px,
- `tileLimit`: тип данных - `string` в формате `'AxB'`, максимальный размер (в относительных единицах кратного превышения над размерами минимальной плитки `'1x1'`) плитки, используемой при раскладке (если пользователь при определении конкретной плитки укажет размер, превышающий установленный этим параметром, размер будет ограничен данным параметром), величина параметра по умолчанию - `'6x4'` (в случае, если выкладываемая плитка будет по горизонтальным размерам превышать возможное для выкладки количество колонок, подобная плитка будет пропорционально уменьшена в размерах до соответствия своих горизонтальных размеров максимальному значению количества колонок выкладки),
- `maxWidth`: тип данных - `integer`, максимальная ширина (в px-единицах) области для раскладки плитки (возможно использование значения `infinity`), величина параметра по умолчанию - `1000`,
- `gap`: тип данных - `integer`, толщина шва (в px-единицах) между плитками, величина параметра по умолчанию - `3`,
- `minCol`: тип данных - `integer`, минимальное количество колонок при раскладке, величина параметра по умолчанию - `2`,
- `maxCol`: тип данных - `integer`, минимальное количество колонок при раскладке, величина параметра по умолчанию - `6`,
- `animate`: тип данных - `boolean`, признак анимации при повторной выкладке плиток по любой причине (например, при наступлении события `resize`, либо изменения количества колонок области выкладки), величина параметра по умолчанию - `true`,
- `animateTime`: тип данных - `integer`, время анимации (в ms), величина параметра по умолчанию - `500`,
- `delayResizeTime`: тип данных - `integer`, время отсрочки выполнения анимации (в ms) при наступлении события `resize`, величина параметра по умолчанию - `500`,
- `tiled`: `callback`-функция с набором параметров `(el, ui)` - вызывается, когда конкретная плитка выкладывается на свое место:
	- `el`: тип данных - `jQuery object`, указатель на плитку, при выкладывании которой была вызвана `callback`-функция,
	- `ui`: тип данных - `object` `{`
		- `index`: тип данных - `integer`, индекс плитки (отсчет от `0`),
		- `tile`: тип данных - `object` `{`
			- x: тип данных - `integer`, горизонтальный размер плитки (в относительных единицах кратного превышения над размерами минимальной плитки `'1x1'`),
			- y: тип данных - `integer`, вертикальный размер плитки (в тех же относительных единицах)`}`,
		- `pos`: тип данных - `object` `{`
			- x: тип данных - `integer`, позиция левого верхнего угла плитки по горизонтали (в относительных единицах) относительно левого верхнего угла области выкладки плиток,
			- y: тип данных - `integer`, позиция левого верхнего угла плитки по вертикали (в относительных единицах) относительно левого верхнего угла области выкладки плиток`}`,
		- `size`: тип данных - `object` `{`
			- x: тип данных - `integer`, реальный горизонтальный размер плитки (может отличаться от соответствующего размера в объекте `tile` в ситуации выкладывания плитки с горизонтальными размерами большими: чем позволяет область выкладки),
			- y: тип данных - `integer`, реальный вертикальный размер плитки`}}`

  Пример кода: Инициализация FloorTiles с определением `callback`-функции:

```js    
$('.floor').floortiles({
	tiled: function (el, ui) {
		el.html(ui.index + 1).wrapInner('<div />');
	}
});
```
