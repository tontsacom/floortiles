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
// el - element,
// ui - object {
	// index: (from 0),
	// tile: {x, y},
	// pos: {x, y},
	// size: {x, y},
	// tileSize: {x, y}
// }
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

			$.extend(this, optionsDefault);

			this.nextStatus = false;
			this.reset(options);
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
			};
			this.columns = Math.max(Math.min(Math.ceil((this.width + this.gap) / this.tileSize.x), this.maxCol), this.minCol);


			var childs = this.$element.find('.floortiles-wrapper').children(),
				state = {
					tiles: [],
					order: [],
					spaces: [],
					holes: [],
					poses: []
				},
				copy = [],
				variants = [],
				time;

			for (var i = 0; i < childs.length; i++) {
				var size = this.minSizeTile(childs.eq(i).data('tile'));
				state.tiles.push({
					i: i,	// надо удалить позднее
					x: size.x,
					y: size.y
				});
				state.order.push(i);
				state.poses.push({
					i: i,	// надо удалить позднее
					x: 0,
					y: 0,
					v: 0
				});
			};

			if (this.debug) time = performance.now(); // only for debug purpose

			this.sitAll(state);

			// цикл итераций (при условии существования дырок) с контролем количества итераций
			for (var iteration = 0, i = 0; state.holes.length > 0 && iteration < 100; iteration++) {
				// найти индекс плитки, создавшей первую (i-ую) дырку
				var j = state.order.findIndex(function(el) {return el == state.holes[i].i;});

				// найти размер дырки (по горизонтали)
				for (var k = 1; i + k < state.holes.length; k++) {
					if (state.holes[i + k].x != state.holes[i].x + k || state.holes[i + k].y != state.holes[i].y) break;
				};
				// увеличить размер дырки (по горизонтали), если дырка "выглядывает"
				for (; state.holes[i].x + k < this.columns; k++) {
					if (state.spaces[state.holes[i].x + k].y > state.holes[i].y) break;
				};

				// найти в плитках, лежащих после плитки, создавшей первую (i-ую) дырку, первой плитки, которая
				// максимально (по размерам по горизонтали) подходит для дырки
				for (var l = j + 1, m = 0, n = 0; l < state.order.length; l++) {
					if (state.tiles[state.order[l]].x == k) break;
					if (state.tiles[state.order[l]].x < k && m < state.tiles[state.order[l]].x) {
						m = state.tiles[state.order[l]].x;
						n = l;
					};
				};
				if (l >= state.order.length) l = n;

				if (l > 0) {

					// нашли плитку, которую можно вставить в дырку
					k = state.tiles[state.order[l]].x;
					// выборка подмассива плиток и его особая сортировка
					copy = state.order.slice(j, l + 1).sort(function(a, b) {
						if ((state.tiles[a].x == k && state.tiles[b].x == k) ||
								(state.tiles[a].x != k && state.tiles[b].x != k)) {
							return a - b;
						} else if (state.tiles[a].x == k) {
							return -1;
						} else {
							return 1;
						};
					});
					k = copy.length;
					while (k--) {
						state.order[j + k] = copy[k];
					};
					copy.length = 0;

				} else {

					// нет плитки, которую можно вставить в дырку
					l = state.holes[i].y;
					for (var m = 0; m < j; m++) {
						copy.push({
							i: state.tiles[state.order[m]].i,
							y: state.poses[state.order[m]].y,
							y2: state.poses[state.order[m]].y + state.tiles[state.order[m]].y
						});
					}

					// определение плитки, с которой надо начинать новую перестановку
					n = copy.filter(function(el) {return el.y <= l && el.y2 > l;}).sort(this.compareH);
					while (n[0].y < l) {
						l = n[0].y;
						n = copy.filter(function(el) {return el.y <= l && el.y2 > l;}).sort(this.compareH);
					}
					m = n[0].i;
					copy.length = 0;

					// перестановка плиток снизу-вверх с "отскоком"
					while (j--) {
						if (state.tiles[state.order[j + 1]].x != state.tiles[state.order[j]].x) state.order.splice(j, 0, state.order.splice(j + 1, 1)[0]);
						if (state.tiles[state.order[j + 1]].i == m) break;
					};

				};
				this.resitAll(state);

				m = state.order.slice(0);
				n = variants.findIndex(function(el) {return el.order.join() == m.join();});
				if (n >= 0) break;
				variants.push({
					order: m,
					holes: state.holes.length,
					height: this.maxSpacesV(0, this.columns, state),
					chaos: this.chaos(state)
				});

			}
			variants.splice(0, n);
			variants.sort(function(a, b) {
				if ((a.holes != b.holes)) {
					return a.holes - b.holes;
				} else if ((a.height != b.height)) {
					return a.height - b.height;
				} else {
					return a.chaos - b.chaos;
				};
			});

			if (this.debug) console.log({ // only for debug purpose
				iteration: iteration,
				time: performance.now() - time,
				floortiles: this
			});
			if (variants.length > 0) {
				state.order = variants[0].order;
				this.resitAll(state);
			};
			this.result(state);
		}

		result(state) {
			var wrapper = this.$element.find('.floortiles-wrapper'),
				childs = wrapper.children(),
				step = this.step(),
				tile,
				tileR,
				pos,
				posR,
				sizeR;

			for (var i = 0; i < state.tiles.length; i++) {
				pos = state.poses[i];
				tile = this.boundSize(state.tiles[i]);
				tileR = this.boundSizeR(tile);
				posR = {
					x: step.x * pos.x,
					y: step.y * pos.v
				};
				sizeR = {
					x: step.x * tileR.x - this.gap,
					y: step.y * tileR.v - this.gap
				};

				this.tiled(childs.eq(i), {
					index: i, 
					tile: tile, 
					pos: posR,
					size: sizeR,
					tileSize: this.tileSize
				});
				if (this.animate && this.nextStatus) {
					childs.eq(i).animate(
						{
							width: sizeR.x + 'px',
							height: sizeR.y +'px',
							left: posR.x + 'px',
							top: posR.y + 'px'
							},
						this.animateTime
					);
				} else {
					childs.eq(i).css({
						width: sizeR.x + 'px',
						height: sizeR.y +'px',
						left: posR.x + 'px',
						top: posR.y + 'px'
					});
				}
			}
			wrapper.css({
				width: (step.x * this.columns - this.gap) + 'px',
				height: (step.y * this.maxSpacesV(0, this.columns, state) - this.gap) + 'px'
			});
		}

		sitAll(state) {
			for (var i = 0; i < this.columns; i++) {
				state.spaces[i] = {
					x: i,	// надо удалить позднее
					y: 0,
					v: 0,
					i: 0	// надо удалить позднее
				};
			}
			for (var i = 0; i < state.order.length; i++) {
				state.poses[state.order[i]] = this.sit(state.tiles[state.order[i]], state);
				console.log(state.poses[state.order[i]].i, state.order[i]);
			}
		}

		resitAll(state) {
			state.spaces.length = 0;
			state.holes.length = 0;
			this.sitAll(state);
		}

		sit(tile, state) {
			var sitTile = this.boundSize(tile),
				findTile;

			if (sitTile.x >= this.columns) {
				sitTile = this.boundSizeR(sitTile);
				findTile = {
					x: 0,
					y: this.maxSpaces(0, this.columns, state),
					v: this.maxSpacesV(0, this.columns, state),
					i: tile.i
				};

				for (var i = 0; i < this.columns; i++) {
					for (var j = state.spaces[i].y; j < findTile.y; j++) {
						state.holes.push({
							x: state.spaces[i].x,
							y: j,
							v: j - state.spaces[i].y + state.spaces[i].v,
							i: tile.i
						});
					};
					state.spaces[i] = {
						x: i,
						y: findTile.y + sitTile.y,
						v: findTile.v + sitTile.v,
						i: tile.i
					};
				};

				state.holes.sort(this.compareH);
				return findTile;
			}

			sitTile = this.boundSizeR(sitTile);
			var spacesM = [];
			for (var i = 0; i < this.columns - sitTile.x + 1; i++) {
				spacesM[i] = {
					x: i,
					y: this.maxSpaces(i, i + sitTile.x, state),
					v: this.maxSpacesV(i, i + sitTile.x, state),
					i: tile.i
				};
			}

			spacesM.sort(this.compareH);
			var holesM = [];
			for (var i = 0; i < state.holes.length; i++) {
				var base = state.holes[i];
				for (var j = 1; j < sitTile.x; j++) {
					if ((i + j >= state.holes.length || state.holes[i + j].x != base.x + j || state.holes[i + j].y != base.y) &&
						(state.holes[i].x + j >= this.columns || state.spaces[state.holes[i].x + j].y > base.y)) break;
				}
				if (j == sitTile.x) holesM.push(base);
			}

			var l = holesM.length;
			if (l > 0 && sitTile.y > 1) {
				holesM.sort(this.compareV);
				for (var i = 0; i < l - sitTile.y + 1; i++) {
					var base = holesM[i];
					for (var j = 1; j < sitTile.y; j++) {
						if (holesM[i + j].x != base.x || holesM[i + j].y != base.y + j) break;
					}
					if (j == sitTile.y) holesM.push(base);
				}
				holesM.splice(0, l);
				holesM.sort(this.compareH);
			}

			if (holesM.length > 0 && this.compareH(holesM[0], spacesM[0]) < 0) {
				findTile = {
					x: holesM[0].x,
					y: holesM[0].y,
					v: holesM[0].v,
					i: tile.i
				};
				for (var i = 0; i < state.holes.length; i++) {
					if (state.holes[i].x == findTile.x && state.holes[i].y == findTile.y) break;
				}
				for (var j = 1; j < sitTile.x && i + j < state.holes.length; j++) {
					if (state.holes[i + j].x != findTile.x + j || state.holes[i + j].y != findTile.y) break;
				}
				state.holes.splice(i, j);
				for (; j < sitTile.x; j++) {
					for (var k = state.spaces[findTile.x + j].y; k < findTile.y; k++) {
						state.holes.push({
							x: state.spaces[findTile.x + j].x,
							y: k,
							v: k, // надо разобраться с этим, ранее было пропущено определение v
							i: tile.i
						});
					}
					state.spaces[findTile.x + j] = {
						x: state.spaces[findTile.x + j].x,
						y: findTile.y + sitTile.y,
						v: findTile.v + sitTile.v,
						i: tile.i
					};
				}
				for (var k = 1; k < sitTile.y; k++) {
					for (; i < state.holes.length; i++) {
						if (state.holes[i].x == findTile.x && state.holes[i].y == findTile.y + k) break;
					}
					for (var j = 1; j < sitTile.x && i + j < state.holes.length; j++) {
						if (state.holes[i + j].x != findTile.x + j || state.holes[i + j].y != findTile.y + k) break;
					}
					state.holes.splice(i, j);
				}
				state.holes.sort(this.compareH);
				return findTile;
			}

			findTile = {
					x: spacesM[0].x,
					y: spacesM[0].y,
					v: spacesM[0].v,
					i: tile.i
				};
			for (var i = findTile.x; i < findTile.x + sitTile.x; i++) {
				for (var j = state.spaces[i].y; j < findTile.y; j++) {
					state.holes.push({
						x: state.spaces[i].x,
						y: j,
						v: j + state.spaces[i].v - state.spaces[i].y,
						i: tile.i
					});
				};
				state.spaces[i] = {
					x: i,
					y: findTile.y + sitTile.y,
					v: findTile.v + sitTile.v,
					i: tile.i
				};
			};
			state.holes.sort(this.compareH);
			spacesM.length = 0;
			return findTile;
		}

		compareH(a, b) {
			if (a.y != b.y) {
				return a.y - b.y;
			} else {
				return a.x - b.x;
			};
		}

		compareV(a, b) {
			if (a.x != b.x) {
				return a.x - b.x;
			} else {
				return a.y - b.y;
			};
		}
/*
		onSit(el, ui) {
			console.log(this);console.log(el);console.log(ui);
		}
*/
		step() {
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

		boundSize(tile) {
			return {
				x: Math.min(tile.x, this.tileLimit.x),
				y: Math.min(tile.y, this.tileLimit.y)
			};
		}

		boundSizeR(tile) {
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

		maxSpaces(start, end, state) {
			var m = state.spaces[start].y;
			for (var i = start + 1; i < end; i++) {
				m = Math.max(m, state.spaces[i].y);
			};
			return m;
		}

		maxSpacesV(start, end, state) {
			var m = state.spaces[start].v;
			for (var i = start + 1; i < end; i++) {
				m = Math.max(m, state.spaces[i].v);
			};
			return m;
		}

		chaos(state) {
			for (var i = 0, c = 0; i < state.order.length; i++) {
				c += Math.abs(i - state.order[i]);
			};
			return c;
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
				$(this).data('floortiles').refresh();
			});
		},

		destroy: function() {
			return this.each(function() {
				$(window).off('.floortiles');
				$(this).data('floortiles').destructor();
				$(this).removeData('floortiles');
			});
		}
	};

	$.fn.floortiles = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('The method named ' + method + ' does not exist in jQuery.floortiles' );
		}
	};

})(jQuery);