CKEDITOR.dialog.add('youtube', function (editor) {
    var youtube_video_id;
    var disabled = editor.config.youtube_disabled_fields || [];

    return {
        title : editor.lang.youtube.title,
        minWidth : 510,
        minHeight : 200,
        onShow: function () {
            for (var i = 0; i < disabled.length; i++) {
                this.getContentElement('youtubePlugin', disabled[i]).disable();
            }
        },
        contents :
            [{
                id : 'youtubePlugin',
                expand : true,
                elements :
                    [
                        {
                            id : 'txtUrl',
                            type : 'textarea',
                            label : editor.lang.youtube.txtUrl,
                            onChange : function (api) {
                                get_video_id_and_time(this, api);
                            },
                            onKeyUp : function (api) {
                                get_video_id_and_time(this, api);
                            },
                            validate : function () {
                                if (this.isEnabled()) {
                                    if (!this.getValue()) {
                                        alert(editor.lang.youtube.noCode);
                                        return false;
                                    }
                                    else{
                                        youtube_video_id = youtube_parser(this.getValue());

                                        if (this.getValue().length === 0 || youtube_video_id === false)
                                        {
                                            alert(editor.lang.youtube.invalidUrl);
                                            return false;
                                        }
                                    }
                                }
                            },
                            setup: function( widget ) {
                                this.setValue( widget.data.src );
                                get_video_id_and_time(this, widget);
                            },
                            commit: function( widget ) {
                                widget.setData( 'src', this.getValue() );
                            }
                        },
                        // {
                        //     type: 'checkbox',
                        //     id: 'is_video_id',
                        //     label: 'is_video_id',
                        //     setup: function (widget) {
                        //         this.setValue(widget.data.is_video_id);
                        //     },
                        //     commit: function (widget) {
                        //         widget.setData('is_video_id', this.getValue() ? 'true' : '');
                        //     },
                        //     // onLoad : function(){
                        //     //     var dialog = this.getDialog();
                        //     //     dialog.getContentElement('youtubePlugin','video_id').getElement().hide();
                        //     // },
                        // },
                        {
                            type: 'hbox',
                            id: 'alignment',
                            children: [ {
                                type: 'radio',
                                id: 'align',
                                label: editor.lang.common.align,
                                items: [
                                    ['По центру', 'center'],
                                    ['По левому краю', 'float-start'],
                                    ['По правому краю', 'float-end'],
                                    ['Нет', 'none'],
                                    ['На всю ширину', 'fullwidth']
                                ],
                                'default': 'center',
                                onChange : function (api) {
                                    alignment_fullwidth(this, api);
                                },
                                onKeyUp : function (api) {
                                    alignment_fullwidth(this, api);
                                },
                                setup: function( widget ) {
                                    if ( widget.data.align ) {
                                        this.setValue( widget.data.align );
                                    }
                                    // alignment_fullwidth(this, widget);
                                },
                                commit: function( widget ) {
                                    widget.setData( 'align', this.getValue() );
                                }
                            } ]
                        },
                        {
                            type : 'html',
                            html : '<hr><strong>Видео в iframe:</strong>'
                        },
                        {
                            type : 'hbox',
                            widths : [ '15%', '70%' ],
                            children :
                                [
                                    {
                                        type: 'text',
                                        id: 'width',
                                        width : '100px',
                                        label : editor.lang.youtube.txtWidth,
                                        'default' : editor.config.youtube_width != null ? editor.config.youtube_width : '640',
                                        validate : function () {
                                            if (!this.getValue()) {
                                                alert(editor.lang.youtube.noWidth);
                                                return false;
                                            }
                                        },
                                        setup: function( widget ) {
                                            if ( widget.data.width ) {
                                                this.setValue( widget.data.width );
                                            }
                                        },
                                        commit: function( widget ) {
                                            widget.setData( 'width', this.getValue() );
                                        }
                                    },
                                    // {
                                    // 	type : 'text',
                                    // 	id : 'txtHeight',
                                    // 	width : '60px',
                                    // 	label : editor.lang.youtube.txtHeight,
                                    // 	'default' : editor.config.youtube_height != null ? editor.config.youtube_height : '360',
                                    // 	validate : function () {
                                    // 		if (this.getValue()) {
                                    // 			// var height = parseInt(this.getValue()) || 0;
                                    // 			//
                                    // 			// if (height === 0) {
                                    // 			// 	alert(editor.lang.youtube.invalidHeight);
                                    // 			// 	return false;
                                    // 			// }
                                    // 		}
                                    // 		else {
                                    // 			alert(editor.lang.youtube.noHeight);
                                    // 			return false;
                                    // 		}
                                    // 	}
                                    // },
                                    {
                                        type: 'select',
                                        id: 'video_aspect_ratio',
                                        label: 'Соотношение сторон видео',
                                        items: [ [ '16:9 (По умолчанию)', 'aspect_ratio_16by9' ], [ '4:3', 'aspect_ratio_4by3' ], [ '21:9', 'aspect_ratio_21by9' ], [ '1:1', 'aspect_ratio_1by1' ] ],
                                        'default': 'aspect_ratio_16by9',
                                        setup: function( widget ) {
                                            if ( widget.data.video_aspect_ratio ) {
                                                this.setValue( widget.data.video_aspect_ratio );
                                            }
                                        },
                                        commit: function( widget ) {
                                            widget.setData( 'video_aspect_ratio', this.getValue() );
                                        }
                                    }
                                ]
                        },
                        {
                            type : 'html',
                            html : '<hr><strong>Видео во всплывающем окне:</strong>'
                        },
                        {
                            id : 'isFancybox',
                            type : 'checkbox',
                            label : editor.lang.youtube.txtNoEmbed,
                            setup: function (widget) {
                                if ( widget.data.isFancybox ) {
                                    this.setValue(widget.data.isFancybox);
                                }
                                isFancybox_fields_disabled(this, widget);
                            },
                            commit: function (widget) {
                                widget.setData('isFancybox', this.getValue() ? 'true' : '');
                            },
                            onChange : function (api) {
                                isFancybox_fields_disabled(this, api);
                                if( this.getValue() ){
                                    width_thumbnail_size(this);
                                }
                            },
                            onKeyUp : function (api) {
                                isFancybox_fields_disabled(this, api);
                                if( this.getValue() ){
                                    width_thumbnail_size(this);
                                }
                            },
                        },
                        {
                            type: 'select',
                            id: 'thumbnail_size',
                            label: 'Размер картинки-превью в контенте',
                            items: [ [ '120x90 с полосами', 'default' ], [ '320x180 без полос (По умолчанию)', 'mqdefault' ], [ '480x360 с полосами', 'hqdefault' ], [ '640x480 с полосами', 'sddefault' ], [ '1280x720 без полос (на старых видео может не быть)', 'maxresdefault' ] ],
                            'default': 'mqdefault',
                            setup: function( widget ) {
                                if ( widget.data.thumbnail_size ) {
                                    this.setValue( widget.data.thumbnail_size );
                                }
                            },
                            commit: function( widget ) {
                                widget.setData( 'thumbnail_size', this.getValue() );
                            },
                            onChange : function (api) {
                                width_thumbnail_size(this);
                            },
                            onKeyUp : function (api) {
                                width_thumbnail_size(this);
                            },
                        },
                        {
                            id : 'altThumbnail',
                            type : 'text',
                            label : 'Alt картинки-превью',
                            setup: function (widget) {
                                this.setValue(widget.data.altThumbnail);
                            },
                            commit: function (widget) {
                                widget.setData( 'altThumbnail', this.getValue() );
                            },
                        },
                        {
                            type : 'html',
                            html : '<hr><strong>Дополнительно:</strong>'
                        },
                        {
                            id : 'chkAutoplay',
                            type : 'checkbox',
                            label : editor.lang.youtube.chkAutoplay,
                            onChange : function (api) {
                                youtube_autoplay(this, api);
                            },
                            onKeyUp : function (api) {
                                youtube_autoplay(this, api);
                            },
                            setup: function (widget) {
                                this.setValue(widget.data.chkAutoplay);
                                youtube_autoplay(this, widget);
                            },
                            commit: function (widget) {
                                widget.setData('chkAutoplay', this.getValue() ? 'true' : '');
                            },
                        },
                        {
                            type: 'checkbox',
                            id: 'loop',
                            label: editor.lang.youtube.loop,
                            onChange : function (api) {
                                youtube_loop(this, api);
                            },
                            onKeyUp : function (api) {
                                youtube_loop(this, api);
                            },
                            setup: function (widget) {
                                this.setValue(widget.data.loop);
                                youtube_loop(this, widget);
                            },
                            commit: function (widget) {
                                widget.setData('loop', this.getValue() ? 'true' : '');
                            }
                        },
                        {
                            id : 'mute',
                            type : 'checkbox',
                            label : editor.lang.youtube.mute,
                            setup: function (widget) {
                                this.setValue(widget.data.mute);
                            },
                            commit: function (widget) {
                                widget.setData('mute', this.getValue() ? 'true' : '');
                            },
                        },
                        {
                            id : 'txtStartAt',
                            type : 'text',
                            label : editor.lang.youtube.txtStartAt,
                            validate : function () {
                                if (this.getValue()) {
                                    var str = this.getValue();

                                    if (!/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/i.test(str)) {
                                        alert(editor.lang.youtube.invalidTime);
                                        return false;
                                    }
                                }
                            },
                            setup: function (widget) {
                                this.setValue(widget.data.txtStartAt);
                            },
                            commit: function (widget) {
                                widget.setData( 'txtStartAt', this.getValue() );
                            },
                        },
                        {
                            id : 'chkControls',
                            type : 'checkbox',
                            label : editor.lang.youtube.chkControls,
                            setup: function (widget) {
                                this.setValue(widget.data.chkControls);
                            },
                            commit: function (widget) {
                                widget.setData('chkControls', this.getValue() ? 'true' : '');
                            },
                        },
                        {
                            id : 'chkRelated',
                            type : 'checkbox',
                            'default' : true,
                            label : editor.lang.youtube.chkRelated,
                            setup: function (widget) {
                                if ( widget.data.chkRelated) {
                                    this.setValue(widget.data.chkRelated);
                                }
                            },
                            commit: function (widget) {
                                widget.setData('chkRelated', this.getValue() ? 'true' : '');
                            },
                        },
                        {
                            id : 'chkPrivacy',
                            type : 'checkbox',
                            label : editor.lang.youtube.chkPrivacy,
                            setup: function (widget) {
                                this.setValue(widget.data.chkPrivacy);
                            },
                            commit: function (widget) {
                                widget.setData('chkPrivacy', this.getValue() ? 'true' : '');
                            },
                        },
                    ]
            }
            ],
    };
});

function get_video_id_and_time(el, api) {
    var video_id = youtube_parser(el.getValue());
    var time = ytVidTime(el.getValue());
    // console.log(time);
    if (video_id) {
        if(time){
            el.getDialog().getContentElement('youtubePlugin', 'txtStartAt').setValue(time);
        } else {
            // не работает
            el.getDialog().getContentElement('youtubePlugin', 'txtStartAt').setValue("");
        }
    }
}

function alignment_fullwidth(el, api) {
    if (el.getValue() == 'fullwidth') {
        el.getDialog().getContentElement('youtubePlugin', 'width').disable();
        el.getDialog().getContentElement('youtubePlugin', 'width').setValue('100%');
    }
    else {
        if( !el.getDialog().getContentElement('youtubePlugin', 'isFancybox').getValue() ){
            el.getDialog().getContentElement('youtubePlugin', 'width').enable();
            // если ширина пуста или равна 100%
            if( el.getDialog().getContentElement('youtubePlugin', 'width').getValue() === '' ||  el.getDialog().getContentElement('youtubePlugin', 'width').getValue() === '100%' ){
                el.getDialog().getContentElement('youtubePlugin', 'width').setValue(640);
            }
        } else {
            // если включено "во вселывающем окне"
            width_thumbnail_size(el);
        }
    }
}

function width_thumbnail_size(el) {
    if ( el.getDialog().getContentElement('youtubePlugin', 'align').getValue() !== 'fullwidth') {
        switch (el.getDialog().getContentElement('youtubePlugin', 'thumbnail_size').getValue()) {
            case "default":
                video_container_fancybox_max_width = 120;
                break;
            case "mqdefault":
                video_container_fancybox_max_width = 320
                break;
            case "hqdefault":
                video_container_fancybox_max_width = 480;
                break;
            case "sddefault":
                video_container_fancybox_max_width = 640;
                break;
            case "maxresdefault":
                video_container_fancybox_max_width = 1280;
                break;
        }

        el.getDialog().getContentElement('youtubePlugin', 'width').setValue(video_container_fancybox_max_width);
    }
}

function isFancybox_fields_disabled(el, api) {
    if (el.getValue()) {
        el.getDialog().getContentElement('youtubePlugin', 'width').disable();
        el.getDialog().getContentElement('youtubePlugin', 'video_aspect_ratio').disable();

        el.getDialog().getContentElement('youtubePlugin', 'thumbnail_size').enable();
        el.getDialog().getContentElement('youtubePlugin', 'altThumbnail').enable();
    }
    else {
        if ( el.getDialog().getContentElement('youtubePlugin', 'align').getValue() != 'fullwidth') {
            el.getDialog().getContentElement('youtubePlugin', 'width').enable();
            el.getDialog().getContentElement('youtubePlugin', 'width').setValue(640);
        }
        el.getDialog().getContentElement('youtubePlugin', 'video_aspect_ratio').enable();

        el.getDialog().getContentElement('youtubePlugin', 'thumbnail_size').disable();
        el.getDialog().getContentElement('youtubePlugin', 'altThumbnail').disable();
    }
}

/**
 * Matches and returns time param in YouTube Urls.
 */
function ytVidTime(url) {
    // var p = /start=([0-9]+)/;
    // // var p = /t=([0-9hms]+)/;
    // return (url.match(p)) ? RegExp.$1 : false;

    var ytVidTime_val;
    var p = /start=([0-9]+)/;
    var p1 = /t=([0-9]+)/;
    if(url.match(p)){
        ytVidTime_val = secondsToHms(RegExp.$1);
    } else if(url.match(p1)) {
        ytVidTime_val = secondsToHms(RegExp.$1);
    }
    return ytVidTime_val ? ytVidTime_val : false;
}

// при включении зацикливания - отключать звук и включать и автовоспроизведение
function youtube_loop(el, api) {
    if (el.getValue()) {
        el.getDialog().getContentElement('youtubePlugin', 'chkAutoplay').setValue(true);
        el.getDialog().getContentElement('youtubePlugin', 'chkAutoplay').disable();
    } else {
        el.getDialog().getContentElement('youtubePlugin', 'chkAutoplay').enable();
        if( !el.getDialog().getContentElement('youtubePlugin', 'autoplay').getValue() ){
            el.getDialog().getContentElement('youtubePlugin', 'mute').enable();
        }
    }
}

// при включении автовоспроизведения - отключать звук
function youtube_autoplay(el, api) {
    if (el.getValue()) {
        el.getDialog().getContentElement('youtubePlugin', 'mute').setValue(true);
        el.getDialog().getContentElement('youtubePlugin', 'mute').disable();
    } else {
        el.getDialog().getContentElement('youtubePlugin', 'mute').enable();
    }
}
