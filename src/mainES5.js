/**
 * @file main.js
 * @desc 便签
 * @version 1.0.0
 * @author 轩辕Rowboat <lxchuan12@163.com>
 * @date 2017-07-02
 * @update 2018-04-30
 * @copyright 2017
 */
import './styles/index';
import './assets/img/btn-close.png';
// app
var app = {
	utils: {},
	store: {}
};
// 工具函数
app.utils = {
	// 获取单个元素
	$: function(selector, node){
		return (node || document).querySelector(selector);
	},
	// 格式化时间
	formatTime: function(timeStamp){
		var time = new Date(timeStamp);
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var date = time.getDate();
		var hour = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();

		function to2bit(num){
			if(num > 9){
				return num;
			}
			else{
				return '0' + num;
			}
		}
		return `${year}-${to2bit(month)}-${to2bit(date)} ${to2bit(hour)}:${to2bit(minute)}:${to2bit(second)}`;
	},
	/**
	 * 绑定事件
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-05-10
	 */
	on: (function(){
		if(document.addEventListener){
			return function(element, event, handler){
				if(element && event && handler){
					element.addEventListener(event, handler, false);
				}
			};
		}
		else{
			return function(element, event, handler){
				if(element && event && handler){
					element.attachEvent('on' + event, handler);
				}
			};
		}
	})(),
	/**
	 * 取消事件
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-05-10
	 */
	off: (function(){
		if(document.removeEventListener){
			return function(element, event, handler){
				if(element && event && handler){
					element.removeEventListener(event, handler, false);
				}
			};
		}
		else{
			return function(element, event, handler){
				if(element && event && handler){
					element.detachEvent('on' + event, handler);
				}
			};
		}
	})(),
};
// 数据存储到本地
app.store = {
	__store_key: '__store_note',
	set: function (id, content){
		// debugger;
		var notes = this.getNotes();
		if(notes[id]){
			Object.assign(notes[id], content);
		}
		else{
			notes[id] = content;
		}
		localStorage[this.__store_key] = JSON.stringify(notes);
	},
	get: function (){
		var jsonStr = window.localStorage[this.__store_key];
		return JSON.parse(jsonStr);
	},
	remove: function (id){
		var notes = this.getNotes();
		delete notes[id];
		localStorage[this.__store_key] = JSON.stringify(notes);
	},
	getNotes: function(){
		return JSON.parse(localStorage[this.__store_key] || '{}');
	}
};
// 立即执行函数
(function (utils, store){
	var $ = utils.$;
	var formatTime = utils.formatTime;
	var on = utils.on;
	var off = utils.off;
	var moveNote = null;
	// 是否限制拖拽范围在可视区 上边缘和左边缘磁性吸附
	var isLimitRange = true;
	var startX;
	var startY;
	var maxZIndex = 0;
	var noteTpl = `
		<i class="u-close"></i>
		<div class="u-bar"></div>
		<div class="u-edit"  contenteditable="true"></div>
		<div class="m-time"><span>更新：</span><span class="u-timestamp">2017-07-02 15:09:02<span></div>`;
	/**
	 * 创建便签
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 * @param {Object} options
	 */
	function Note(options){
		var note = document.createElement('div');
		note.className = 'm-note';
		note.id = options.id || 'm-note-' + Date.now();
		note.innerHTML = noteTpl;
		$('.u-edit', note).innerHTML = options.content || '';
		note.style.left = options.left + 'px';
		note.style.top = options.top + 'px';
		note.style.zIndex = options.zIndex;
		document.body.appendChild(note);
		this.note = note;
		this.updateTime(options.updateTimeStamp);
		this.addEvent();
	}
	/**
	 * 初始化便签
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 */
	Note.prototype.init = function(){
		var notes = store.getNotes();
		Object.keys(notes).forEach(function(id){
			var options = notes[id];
			if(maxZIndex < options.zIndex){
				maxZIndex = options.zIndex;
			}
			var note = new Note(Object.assign(options, {
				id: id
			}));
			console.log('init-note', note);
		});
		maxZIndex += 1;
	};
	/**
	 * 便签保存
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 */
	Note.prototype.save = function (){
		var that = this;
		var dataStore = {
			zIndex: that.note.style.zIndex,
			left: that.note.offsetLeft,
			// 弄清offsetLeft 和 left 的区别 前者只读，后者可读可写
			// left: parseInt(that.note.style.left),
			top: that.note.offsetTop,
			content: $('.u-edit', that.note).innerHTML,
			updateTimeStamp: that.updateTimeInMS
		};
		store.set(this.note.id, dataStore);
	};
	/**
	 * 便签关闭
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 */
	Note.prototype.close = function (){
		document.body.removeChild(this.note);
	};
	/**
	 * 便签更新时间
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 */
	Note.prototype.updateTime = function (ms){
		var nowTimeStamp = ms || Date.now();
		var formatTimeStr = formatTime(nowTimeStamp);
		$('.m-time .u-timestamp', this.note).innerHTML = formatTimeStr;
		this.updateTimeInMS = nowTimeStamp;
	};
	/**
	 * 便签添加事件
	 * @author luoxiaochuan <lxchuan12@163.com>
	 * @date 2018-04-30
	 */
	Note.prototype.addEvent = function (){
		let that = this;
		var btnClose = $('.u-close', this.note);
		// 便签的 mousedown 事件
		var handleMousedown = function (ev){
			// console.log(ev);
			moveNote = that.note;
			if(moveNote.setCapture){
				moveNote.setCapture();
			}
			startX = ev.clientX - that.note.offsetLeft;
			startY = ev.clientY - that.note.offsetTop;
			if(moveNote.style.zIndex !== maxZIndex - 1){
				moveNote.style.zIndex = maxZIndex++;
				store.set(moveNote.id, {
					zIndex: maxZIndex - 1
				});
			}
			// console.log('mousedown');
		};
		on(that.note, 'mousedown', handleMousedown);
		var inputTimer;
		// 便签的 input 输入事件
		var editNote = $('.u-edit', that.note);
		var handleInput = function (ev){
			// console.log('handleInput');
			var content = editNote.innerHTML;
			clearTimeout(inputTimer);
			inputTimer = setTimeout(function (){
				var time = Date.now();
				store.set(that.note.id, {
					content: content,
					updateTimeStamp: time
				});
				that.updateTime(time);
			}, 300);
		};
		on(editNote, 'input', handleInput);
		// 便签的 关闭 事件
		var handleCloseClick = function (ev){
			// 不为空时提示是否删除。
			var content = editNote.innerHTML;
			if(content !== ''){
				var result = window.confirm('是否要删除此便签？');
				if(!result){
					return;
				}
			}
			store.remove(that.note.id);
			// console.log('close click', that.note);
			// 关闭的同时移除事件
			off(btnClose, 'click', handleCloseClick);
			off(that.note, 'mousedown', handleMousedown);
			that.close();
		};
		on(btnClose, 'click', handleCloseClick);
	};
	on(document, 'DOMContentLoaded', function (e){
		// 初始化保存在localstorage里的便签
		function initLocal(){
			// debugger;
			var notes = store.getNotes();
			// console.log('initLocal function notes', notes);
			Object.keys(notes).forEach(function(id){
				var options = notes[id];
				// console.log('initLocal',options);
				if(maxZIndex < options.zIndex){
					maxZIndex = options.zIndex;
				}
				var note = new Note(Object.assign(options, {
					id: id
				}));
				console.log('initLocal', note);
			});
			maxZIndex += 1;
		}
		initLocal();
		var handleBtnCreate = function (){
			var options = {
				left: Math.floor(Math.random() * (window.innerWidth - 200)),
				top: Math.floor(Math.random() * (window.innerHeight - 250)),
				zIndex: maxZIndex++
			};
			var note = new Note(options);
			note.save();
		};
		var handleMousemove = function (ev){
			if(!moveNote){
				return;
			}

			var L = ev.clientX - startX;
			var T = ev.clientY - startY;

			if(isLimitRange){
				var width = document.documentElement.clientWidth - moveNote.offsetWidth;
				var height = document.documentElement.clientHeight - moveNote.offsetHeight;
				if(L < 0){
					L = 0;
				}
				else if(L > width){
					L = width;
				}

				if(T < 0){
					T = 0;
				}
				else if(T > height){
					T = height;
				}
			}

			moveNote.style.left = L + 'px';
			moveNote.style.top = T + 'px';
			// console.log('move', ev);
		};
		var handleMouseup = function (){
			if(!moveNote){
				return;
			}
			store.set(moveNote.id, {
				left: moveNote.offsetLeft,
				top: moveNote.offsetTop
			});
			if(moveNote.releaseCapture){
				moveNote.releaseCapture();
			}
			moveNote = null;
			// 把事件解除
			// off(document, 'mousemove', handleMousemove);
		};
		// 清除所有的便签
		var handleBtnRemoveAllNotes = function (){
			// 有便签就提示是否删除所有便签
			var hasNote = [...document.querySelectorAll('.m-note')].length > 0;
			if(hasNote){
				var result = window.confirm('是否要清除所有便签？');
				if(!result){
					return;
				}
			}
			// 思路1：主动触发把所有的便签关闭事件
			[...document.querySelectorAll('.u-close')].forEach((element) => {
				element.click();
			});
		};
		// 创建便签
		on($('#create'), 'click', handleBtnCreate);
		on(document, 'mousemove', handleMousemove);
		on(document, 'mouseup', handleMouseup);
		// 清除所有的便签
		on($('#remove'), 'click', handleBtnRemoveAllNotes);
		// console.log($('.m-note .u-close'));
	});
}(app.utils, app.store));
// console.log(1);
if(module.hot){
	// 实现热更新
	module.hot.accept('./styles/index.less', function(){
		console.log('hot-accept-style-less-2');
	});
}
