/*!
 * FloorTiles v1.1 (https://github.com/tontsacom/floortiles)
 * Copyright 2017
 * Licensed under the MIT license
 */
(function($) {

	var optionsDefault = {
		tileSize: {
			x: 200,
			y: 150
		},
		tileLimit: {
			x: 6,
			y: 4
		},
		maxWidth: 1000,
		gap: 3,
		minCol: 2,
		maxCol: 6,
		animate: true,
		animateTime: 500,
		delayResizeTime: 500,
		debug: false, // only for debug purpose
		tiled: function(el, ui) {
// el - element, ui - {index: (from 0), tile: {x, y}, pos: {x, y}, size: {x, y}, tileSize: {x, y}}
		}
	}

	class floortiles {
		constructor(element, options) {
			this.$element = $(element);

			var childs = this.$element.children();
			if (childs.length == 0) $.error('No tiles in jQuery.floortiles');
			if (!childs.eq(0).data('tile')) $.error('The tile size of the element 0 in jQuery.floortiles is not specified');
			var tag = childs.get(0).tagName;
			for (var i = 1; i < childs.length; i++) {
				if (!childs.eq(i).data('tile')) $.error('The tile size of the element ' + i + ' in jQuery.floortiles is not specified');
				if (childs.get(i).tagName != tag) $.error('Not the same tags in tiles in jQuery.floor');
			}
			childs.css({
				position: 'absolute'
			});
			this.$element.wrapInner('<div class="floortiles-wrapper" style="position: relative;max-width: 100%;margin: 0 auto;" />');

			this.tiles = [];
			this.spaces = [];
			this.holes = [];
			this.poses = [];
			$.extend(this, optionsDefault);

			this.nextStatus = false;
			this.reset(options)
			this.nextStatus = true;
		}

		destructor() {
			this.$element.html(this.$element.children().html());
			this.$element.children().removeAttr('style');
		}

		reset(options) {
			for (var option in options) {
				if (option in optionsDefault) {
					switch (option) {
						case 'tileSize':
							var size = this.minSize(options[option], '40x30');
							if (!size) $.error('Wrong value ' + options[option] + ' of property ' + option + ' in jQuery.floortiles');
							this[option] = size;
						break;
						case 'tileLimit':
							var size = this.size(options[option]);
							if (!size) $.error('Wrong value ' + options[option] + ' of property ' + option + ' in jQuery.floortiles');
							this[option] = size;
						break;
						default:
							this[option] = options[option];
					}
				} else {
					$.error('Undefined property ' + option + ' in jQuery.floortiles');
				}
			}
			
			this.refresh();
		}

		refresh() {
			if (typeof this.maxWidth == 'number') {
				this.width = Math.min(this.$element.width(), this.maxWidth);
			} else if (this.maxWidth == 'none') {
				this.width = this.$element.width();
			} else {
				$.error('Wrong value of property maxWidth in jQuery.floortiles');
			}
			this.columns = Math.max(Math.min(Math.ceil((this.width + this.gap) / this.tileSize.x), this.maxCol), this.minCol);

			var wrapper = this.$element.find('.floortiles-wrapper'),
				childs = wrapper.children(),
				step = this.step(),
				tile,
				tileR,
				pos,
				posR,
				sizeR,
				time;

			this.tiles.length = 0;
			for (var i = 0; i < childs.length; i++) {
				var size = this.minSizeTile(childs.eq(i).data('tile'));
				this.tiles.push({
					i: i,
					x: size.x,
					y: size.y
				});
			}

			if (this.debug) time = performance.now(); // only for debug purpose

			this.sitAll();
			this.consoleArr(this.tiles, 'i'); // only for debug purpose

			for (var iteration = 0, i = 0; this.holes.length > 0 && iteration < 100; iteration++) {
				for (var j = 1; j < this.tiles.length; j++) {
					if (this.tiles[j].i == this.holes[i].i) break;
				};

				for (; i < this.holes.length; i++) {
					for (var k = 1; i + k < this.holes.length; k++) {
						// возможно здесь надо добавить условие на проверку не только обычных дырок, но и "выглядывающих" дырок
						if (this.holes[i + k].x != this.holes[i].x + k || this.holes[i + k].y != this.holes[i].y) break;
					};
					for (var l = j + 1, m = 0, n = 0; l < this.tiles.length; l++) {
						if (this.tiles[l].x == k) break;
						if (this.tiles[l].x < k && m < this.tiles[l].x) {
							m = this.tiles[l].x;
							n = l;
						};
					};
					if (l == this.tiles.length) l = n;
					if (l > 0) break; // здесь прерываем - нашли плитку, которую можно вставить в дырку[i]
/*
					console.log(j, l, i, this.holes[i], this.poses);
					l = 0;
					break;
*/
				};
				if (l == 0) break; // здесь прерываем - нет плитки, которую можно вставить в какую-либо дырку

				subSort(this.tiles, j, l, this.tiles[l].x);
				this.sitAll();

				this.consoleArr(this.tiles, 'i'); // only for debug purpose
			}

			if (this.debug) console.log({ // only for debug purpose
				iteration: iteration,
				time: performance.now() - time
			}, this);

			for (var i = 0; i < this.tiles.length; i++) {
				pos = this.poses[i];
				tile = this.boundSize(this.tiles[i]);
				tileR = this.boundSizeR(tile);
				posR = {
					x: step.x * pos.x,
					y: step.y * pos.v
				};
				sizeR = {
					x: step.x * tileR.x - this.gap,
					y: step.y * tileR.v - this.gap
				};

				this.tiled(childs.eq(this.tiles[i].i), {
					index: this.tiles[i].i, 
					tile: tile, 
					pos: posR,
					size: sizeR,
					tileSize: this.tileSize
				});
				if (this.animate && this.nextStatus) {
					childs.eq(this.tiles[i].i).animate(
						{
							width: sizeR.x + 'px',
							height: sizeR.y +'px',
							left: posR.x + 'px',
							top: posR.y + 'px'
							},
						this.animateTime
					);
				} else {
					childs.eq(this.tiles[i].i).css({
						width: sizeR.x + 'px',
						height: sizeR.y +'px',
						left: posR.x + 'px',
						top: posR.y + 'px'
					});
				}
			}
			wrapper.css({
				width: (step.x * this.columns - this.gap) + 'px',
				height: (step.y * this.maxSpacesV(0, this.columns) - this.gap) + 'px'
			});

			function subSort(arr, start, end, x){
				var sub = arr.slice(start, end + 1).sort(compare),
					i = sub.length;
				while (i--) {
					arr[start + i] = sub[i];
				}

				function compare(a, b){
					if ((a.x == x && b.x == x) || (a.x != x && b.x != x)) {
						return a.i - b.i;
					} else if (a.x == x) {
						return -1;
					} else {
						return 1;
					};
				}
			}
		}

		sitAll() {
			this.holes.length = 0;
			this.spaces.length = 0;
			for (var i = 0; i < this.columns; i++) {
				this.spaces[i] = {
					x: i,
					y: 0,
					v: 0,
					i: 0
				};
			}
			this.poses.length = 0;
			for (var i = 0; i < this.tiles.length; i++) {
				this.poses.push(this.sit(this.tiles[i]));
			}
		}

		sit(tile) {
			var sitTile = this.boundSize(tile),
				findTile;

			if (sitTile.x >= this.columns) {
				sitTile = this.boundSizeR(sitTile);
				findTile = {
					x: 0,
					y: this.maxSpaces(0, this.spaces.length),
					v: this.maxSpacesV(0, this.spaces.length),
					i: tile.i
				};

				for (var i = 0; i < this.spaces.length; i++) {
					for (var j = this.spaces[i].y; j < findTile.y; j++) {
						this.holes.push({
							x: this.spaces[i].x,
							y: j,
							v: j - this.spaces[i].y + this.spaces[i].v,
							i: tile.i
						});
					};
					this.spaces[i] = {
						x: i,
						y: findTile.y + sitTile.y,
						v: findTile.v + sitTile.v,
						i: tile.i
					};
				};

				this.holes.sort(compareH);
				return findTile;
			}

			sitTile = this.boundSizeR(sitTile);
			var spacesM = [];
			for (var i = 0; i < this.spaces.length - sitTile.x + 1; i++) {
				spacesM[i] = {
					x: i,
					y: this.maxSpaces(i, i + sitTile.x),
					v: this.maxSpacesV(i, i + sitTile.x),
					i: tile.i
				};
			}

			spacesM.sort(compareH);
			var holesM = [];
			for (var i = 0; i < this.holes.length; i++) {
				var base = this.holes[i];
				for (var j = 1; j < sitTile.x; j++) {
					if ((i + j >= this.holes.length || this.holes[i + j].x != base.x + j || this.holes[i + j].y != base.y) &&
						(this.holes[i].x + j >= this.spaces.length || this.spaces[this.holes[i].x + j].y > base.y)) break;
				}
				if (j == sitTile.x) holesM.push(base);
			}

			var l = holesM.length;
			if (l > 0 && sitTile.y > 1) {
				holesM.sort(compareV);
				for (var i = 0; i < l - sitTile.y + 1; i++) {
					var base = holesM[i];
					for (var j = 1; j < sitTile.y; j++) {
						if (holesM[i + j].x != base.x || holesM[i + j].y != base.y + j) break;
					}
					if (j == sitTile.y) holesM.push(base);
				}
				holesM.splice(0, l);
				holesM.sort(compareH);
			}

			if (holesM.length > 0 && compareH(holesM[0], spacesM[0]) < 0) {
				findTile = holesM[0];
				for (var i = 0; i < this.holes.length; i++) {
					if (this.holes[i].x == findTile.x && this.holes[i].y == findTile.y) break;
				}
				for (var j = 1; j < sitTile.x && i + j < this.holes.length; j++) {
					if (this.holes[i + j].x != findTile.x + j || this.holes[i + j].y != findTile.y) break;
				}
				this.holes.splice(i, j);
				for (; j < sitTile.x; j++) {
					for (var k = this.spaces[findTile.x + j].y; k < findTile.y; k++) {
						this.holes.push({
							x: this.spaces[findTile.x + j].x,
							y: k,
							v: k, // надо разобраться с этим, ранее было пропущено определение v
							i: tile.i
						});
					}
					this.spaces[findTile.x + j] = {
						x: this.spaces[findTile.x + j].x,
						y: findTile.y + sitTile.y,
						v: findTile.v + sitTile.v,
						i: tile.i
					};
				}
				for (var k = 1; k < sitTile.y; k++) {
					for (; i < this.holes.length; i++) {
						if (this.holes[i].x == findTile.x && this.holes[i].y == findTile.y + k) break;
					}
					for (var j = 1; j < sitTile.x && i + j < this.holes.length; j++) {
						if (this.holes[i + j].x != findTile.x + j || this.holes[i + j].y != findTile.y + k) break;
					}
					this.holes.splice(i, j);
				}
				this.holes.sort(compareH);
				return findTile;
			}

			findTile = spacesM[0];
			for (var i = findTile.x; i < findTile.x + sitTile.x; i++) {
				for (var j = this.spaces[i].y; j < findTile.y; j++) {
					this.holes.push({
						x: this.spaces[i].x,
						y: j,
						v: j + this.spaces[i].v - this.spaces[i].y,
						i: tile.i
					});
				};
				this.spaces[i] = {
					x: i,
					y: findTile.y + sitTile.y,
					v: findTile.v + sitTile.v,
					i: tile.i
				};
			};
			this.holes.sort(compareH);
			spacesM.length = 0;
			return findTile;

			function compareH(a, b){
				if (a.y != b.y) {
					return a.y - b.y;
				} else {
					return a.x - b.x;
				};
			}

			function compareV(a, b){
				if (a.x != b.x) {
					return a.x - b.x;
				} else {
					return a.y - b.y;
				};
			}
		}
/*
		onSit(el, ui) {
			console.log(this);console.log(el);console.log(ui);
		}
*/
		step(){
			var w = Math.min(Math.round(((this.width + this.gap) / this.columns) - this.gap), this.tileSize.x);
			return {
				x: w + this.gap,
				y: Math.round(w / this.tileSize.x * this.tileSize.y) + this.gap
			};
		}

		size(tile) {
			var couple = tile.split('x');
			if (couple.length != 2) return false;
			return {
				x: parseInt(couple[0]),
				y: parseInt(couple[1])
			};
		}

		minSize(tile, minTile) {
			var size = this.size(tile);
			if (!size) return false;
			var sizeM = this.size(minTile);
			return {
				x: Math.max(size.x, sizeM.x),
				y: Math.max(size.y, sizeM.y)
			};
		}

		minSizeTile(tile) {
			var size = this.minSize(tile, '1x1');
			if (!size) return {
				x: 1,
				y: 1
			};
			return size;
		}

		boundSize(tile){
			return {
				x: Math.min(tile.x, this.tileLimit.x),
				y: Math.min(tile.y, this.tileLimit.y)
			};
		}

		boundSizeR(tile){
			if (tile.x > this.columns) return {
				x: this.columns,
				y: 1,
				v: tile.y / tile.x * this.columns
			};
			if (tile.x == this.columns) return {
				x: this.columns,
				y: 1,
				v: tile.y
			};
			return {
				x: tile.x,
				y: tile.y,
				v: tile.y
			};
		}

		maxSpaces(start, end){
			var m = this.spaces[start].y;
			for (var i = start + 1; i < end; i++) {
				m = Math.max(m, this.spaces[i].y);
			};
			return m;
		}

		maxSpacesV(start, end){
			var m = this.spaces[start].v;
			for (var i = start + 1; i < end; i++) {
				m = Math.max(m, this.spaces[i].v);
			};
			return m;
		}

		consoleArr(arr, el){ // only for debug purpose
			for (var i = 0, s = ''; i < arr.length; i++) {
				if (i > 0) s += '/';
				s += arr[i][el];
			};
			console.log(s);
		}

	}

	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('floortiles'),
					timeout;

				if (!data) {
					data = new floortiles(this, options);
					$(window).on('resize.floortiles', function() {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(function() {
								data.refresh();
							},
							data.delayResizeTime);
					});
				} else {
					data.reset(options);
				}

				$this.data('floortiles', data);
			});
		},

		refresh: function() {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('floortiles');
				data.refresh();
			});
		},

		destroy: function() {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('floortiles');
				$(window).off('.floortiles');
				data.destructor();
				$this.removeData('floortiles');
			});
		}
	};

	$.fn.floortiles = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метод с именем ' + method + ' не существует для jQuery.floortiles' );
		}
	};

})(jQuery);