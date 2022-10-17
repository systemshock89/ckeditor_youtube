CKEDITOR.plugins.add( 'youtube', {
    requires: 'widget',
    lang: [ 'en', 'bg', 'pt', 'pt-br', 'ja', 'hu', 'it', 'fr', 'tr', 'ru', 'de', 'ar', 'nl', 'pl', 'vi', 'zh', 'el', 'he', 'es', 'nb', 'nn', 'fi', 'et', 'sk', 'cs', 'ko', 'eu', 'uk'],
    icons: 'youtube',
    onLoad: function() {
        CKEDITOR.addCss(
            // video-container
            '.video-container' +
            '{' +
            'max-width: 100%;' +
            'position: relative;' +
            'overflow: hidden;' +
            'background: #EEEEEE;' +
            'border: 3px solid #d7dee3;' +
            'margin-bottom: 18px;' +
            '}' +
            '.video-container:before' +
            '{' +
            'content: "";' +
            'display: block;' +
            '}' +
            '.video-container iframe' +
            '{' +
            'position: absolute;' +
            'top: 0;' +
            'bottom: 0;' +
            'left: 0;' +
            'width: 100%!important;' +
            'height: 100%!important;' +
            '}' +
            '.video-container iframe.lazy' +
            '{' +
            'display: none;' +
            '}' +
            '.video-container:before,' +
            '.video-container.aspect_ratio_16by9:before' +
            '{' +
            'padding-top: 56.25%;' +
            '}' +
            '.video-container.aspect_ratio_21by9:before' +
            '{' +
            'padding-top: 42.86%;' +
            '}' +
            '.video-container.aspect_ratio_4by3:before' +
            '{' +
            'padding-top: 75%;' +
            '}' +
            '.video-container.aspect_ratio_1by1:before' +
            '{' +
            'padding-top: 100%;' +
            '}' +

            '.video-container.float-start,' +
            '.video-container-fancybox.float-start' +
            '{' +
            'float: left;' +
            'margin-right: 30px;' +
            '}' +
            '.video-container.float-end,' +
            '.video-container-fancybox.float-end' +
            '{' +
            'float: right;' +
            'margin-left: 30px;' +
            '}' +
            '.video-container.center' +
            '{' +
            'margin-left: auto;' +
            'margin-right: auto;' +
            '}' +

            // video-container-fancybox
            '.video-container-fancybox' +
            '{' +
            'max-width: 100%;' +
            'position: relative;' +
            'overflow: hidden;' +
            'background: #EEEEEE;' +
            'border: 3px solid #d7dee3;' +
            'display: inline-block;' +
            'margin-bottom: 18px;' +
            '}' +
            '.video-container-fancybox:before' +
            '{' +
            'content: "";' +
            'display: block;' +
            'padding-top: 56.25%;' +
            '}' +
            '.video-container-fancybox img' +
            '{' +
            'position: absolute;' +
            'top: 0;' +
            'bottom: 0;' +
            'left: 0;' +
            'width: 100%!important;' +
            'height: 100%!important;' +
            '}' +
            '.video-container-fancybox img.lazy' +
            '{' +
            'display: none;' +
            '}' +
            '.video-container-fancybox.center' +
            '{' +
            'margin-left: auto;' +
            'margin-right: auto;' +
            'display: table !important;' +
            '}' +
            '.video-container-fancybox.fullwidth' +
            '{' +
            'display: block !important;' +
            '}' +
            '.cke_widget_wrapper_video-container-fancybox' +
            '{' +
            'display: block!important;' +
            '}' +

            '.video-container:after,' +
            '.video-container-fancybox:after' +
            '{' +
            'content: "▶";' +
            'position: absolute;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'font-size: 60px;' +
            'color: gray;' +
            '}'
        );
    },
    init: function( editor ) {
        editor.widgets.add( 'youtube', {
            button: editor.lang.youtube.button,
            template: '<div class="video-container"></div>',
            /*
             * Allowed content rules (http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules):
             *  - div-s with text-align,float,margin-left,margin-right inline style rules and required ckeditor-html5-video class.
             *  - video tags with src, controls, width and height attributes.
             */
            allowedContent: 'div{*}(*); iframe{*}[!width,!height,!src,!frameborder,!allowfullscreen,!allow]; object param[*]; a[*]; img[*]',
            // allowedContent: 'div[data-responsive](!ckeditor-html5-video){text-align,float,margin-left,margin-right}; video[src,poster,controls,autoplay,width, height,loop]{max-width,height};',
            requiredContent: 'div(video-container); a(video-container-fancybox); iframe[src]; img[src];',
            upcast: function( element ) {
                return (element.name === 'div' && element.hasClass( 'video-container' ) ) ||  (element.name === 'a' && element.hasClass( 'video-container-fancybox' ) );
            },
            dialog: 'youtube',
            init: function() {
                var src = '';
                var align = 'none';
                var width = '';
                var video_aspect_ratio = 'aspect_ratio_16by9';
                var isFancybox = '';
                var thumbnail_size = 'mqdefault';
                var altThumbnail = '';
                var chkAutoplay = '';
                var txtStartAt = '';
                var chkPrivacy = '';
                var chkRelated = '';
                var chkControls = '';
                var mute = '';
                var loop = '';

                if( this.element.hasClass( 'fullwidth' ) ){
                    width = this.element.getStyle( 'width' ); // width: 100%
                } else {
                    width = this.element.getStyle( 'width' ).replace('px', '');
                }

                if( this.element.hasClass( 'float-start' ) ){
                    align = 'float-start';
                } else if( this.element.hasClass( 'float-end' ) ){
                    align = 'float-end';
                } else if( this.element.hasClass( 'center' ) ){
                    align = 'center';
                } else if( this.element.hasClass( 'fullwidth' ) ){
                    align = 'fullwidth';
                }

                if( this.element.hasClass( 'aspect_ratio_16by9' ) ){
                    video_aspect_ratio = 'aspect_ratio_16by9';
                } else if( this.element.hasClass( 'aspect_ratio_4by3' ) ){
                    video_aspect_ratio = 'aspect_ratio_4by3';
                } else if( this.element.hasClass( 'aspect_ratio_21by9' ) ){
                    video_aspect_ratio = 'aspect_ratio_21by9';
                } else if( this.element.hasClass( 'aspect_ratio_1by1' ) ){
                    video_aspect_ratio = 'aspect_ratio_1by1';
                }

                if( this.element.hasClass( 'video-container-fancybox' ) ){
                    isFancybox = true;
                }

                // If there's a child (the video element)
                if ( this.element.getChild( 0 ) ) {
                    // get it's attributes.
                    if( !isFancybox ){
                        src = this.element.getChild( 0 ).getAttribute( 'data-src' );
                    } else {
                        src = this.element.getAttribute( 'href' );
                    }

                    if(src){

                        if( isFancybox ){

                            var src_thumbnail = this.element.getChild( 0 ).getAttribute( 'data-src' );

                            if( src_thumbnail.includes('/default.jpg') ){
                                thumbnail_size = 'default';
                            } else if( src_thumbnail.includes('/mqdefault.jpg') ){
                                thumbnail_size = 'mqdefault';
                            } else if( src_thumbnail.includes('/hqdefault.jpg') ){
                                thumbnail_size = 'hqdefault';
                            } else if( src_thumbnail.includes('/sddefault.jpg') ){
                                thumbnail_size = 'sddefault';
                            } else if( src_thumbnail.includes('/maxresdefault.jpg') ){
                                thumbnail_size = 'maxresdefault';
                            }

                            altThumbnail =  this.element.getChild( 0 ).getAttribute( 'alt' );
                        }

                        if ( src.includes('www.youtube-nocookie.com/') ) {
                            chkPrivacy = true;
                        } else {
                            chkPrivacy = false;
                        }

                        parameters = src.replace( '?', '');
                        chkAutoplay = parameters.includes('autoplay=1');
                        if(getParam('start', src) != 0){
                            txtStartAt = secondsToHms(getParam('start', src));
                        }

                        chkRelated = parameters.includes('rel=0');
                        chkControls = parameters.includes('controls=0');
                        mute = parameters.includes('mute=1');
                        loop = parameters.includes('loop=1&playlist=');
                    }
                }

                if ( src ) {
                    this.setData( 'src', src );

                    if ( align ) {
                        this.setData( 'align', align );
                    }

                    if ( width ) {
                        this.setData( 'width', width );
                    }

                    if ( video_aspect_ratio ) {
                        this.setData( 'video_aspect_ratio', video_aspect_ratio );
                    }

                    if ( isFancybox ) {
                        this.setData( 'isFancybox', isFancybox );
                    }

                    if ( altThumbnail ) {
                        this.setData( 'altThumbnail', altThumbnail );
                    }

                    if ( thumbnail_size ) {
                        this.setData( 'thumbnail_size', thumbnail_size );
                    }

                    if ( chkAutoplay ) {
                        this.setData( 'chkAutoplay', chkAutoplay );
                    }

                    if ( txtStartAt ) {
                        this.setData( 'txtStartAt', txtStartAt );
                    }

                    if ( chkPrivacy ) {
                        this.setData( 'chkPrivacy', chkPrivacy );
                    }

                    if ( chkRelated ) {
                        this.setData( 'chkRelated', chkRelated );
                    }

                    if ( chkControls ) {
                        this.setData( 'chkControls', chkControls );
                    }

                    if ( mute ) {
                        this.setData( 'mute', mute );
                    }

                    if ( loop ) {
                        this.setData( 'loop', loop );
                    }

                }
            },
            data: function() {
                var url = '';
                var domen = '';
                var params = [];

                // Выравнивание
                this.element.removeClass( 'float-start' );
                this.element.removeClass( 'float-end' );
                this.element.removeClass( 'center' );
                this.element.removeClass( 'fullwidth' );
                this.element.removeClass( 'none' );
                if (this.data.align) this.element.addClass(this.data.align);

                // Соотношение сторон видео
                this.element.removeClass( 'aspect_ratio_16by9' );
                this.element.removeClass( 'aspect_ratio_4by3' );
                this.element.removeClass( 'aspect_ratio_21by9' );
                this.element.removeClass( 'aspect_ratio_1by1' );

                if ( this.data.src ) {

                    // and there isn't a child (the video element)
                    if ( !this.element.getChild( 0 ) ) {
                        if ( !this.data.isFancybox ) {
                            var videoElement = new CKEDITOR.dom.element('iframe');
                        } else {
                            var videoElement = new CKEDITOR.dom.element('img');
                        }
                        // Append it to the container of the plugin.
                        this.element.append( videoElement );
                    }

                    if ( !this.data.isFancybox ) {
                        // video-container (iframe)
                        this.element.renameNode( 'div' );
                        this.element.getChild( 0 ).renameNode( 'iframe' );

                        this.element.addClass( 'video-container' );
                        this.element.removeClass( 'video-container-fancybox' );
                        this.element.removeClass( 'img-container');

                        this.element.removeAttribute('data-fancybox');

                        // Максимальная ширина видео
                        if ( this.data.width ) {
                            // this.element.setStyle( 'width', this.data.width + 'px' );

                            if( this.element.hasClass( 'fullwidth' ) ){
                                this.element.setStyle( 'width', this.data.width); // width: 100%
                            } else {
                                this.element.setStyle( 'width', this.data.width + 'px' );
                            }
                        } else {
                            this.element.removeStyle( 'width' );
                        }

                        // Соотношение сторон видео
                        if (this.data.video_aspect_ratio) this.element.addClass(this.data.video_aspect_ratio);

                    } else {
                        // video-container-fancybox (img preview)
                        this.element.renameNode( 'a' );
                        this.element.getChild( 0 ).renameNode( 'img' );

                        this.element.addClass( 'video-container-fancybox');
                        this.element.addClass( 'img-container');
                        this.element.removeClass( 'video-container' );

                        this.element.setAttribute('data-fancybox', "");

                        // Максимальная ширина видео
                        switch (this.data.thumbnail_size) {
                            case "default":
                                video_container_fancybox_max_width = 120;
                                video_container_fancybox_max_height = 90;
                                break;
                            case "mqdefault":
                                video_container_fancybox_max_width = 320;
                                video_container_fancybox_max_height = 180;
                                break;
                            case "hqdefault":
                                video_container_fancybox_max_width = 480;
                                video_container_fancybox_max_height = 360;
                                break;
                            case "sddefault":
                                video_container_fancybox_max_width = 640;
                                video_container_fancybox_max_height = 480;
                                break;
                            case "maxresdefault":
                                video_container_fancybox_max_width = 1280;
                                video_container_fancybox_max_height = 720;
                                break;
                        }
                        if ( this.data.width ) {
                            if( this.element.hasClass( 'fullwidth' ) ){
                                this.element.setStyle( 'width', this.data.width); // width: 100%
                            } else {
                                this.element.setStyle( 'width', video_container_fancybox_max_width + 'px' );
                            }
                        } else {
                            this.element.removeStyle( 'width' );
                        }

                    }
                }

                if ( this.element.getChild( 0 ) ) {

                    this.element.getChild( 0 ).addClass('lazy');

                    video_id = youtube_parser(this.data.src);
                    if (video_id) {

                        if (this.data.chkAutoplay) {
                            params.push('autoplay=1');
                        }

                        if (this.data.txtStartAt) {
                            startSecs = this.data.txtStartAt;
                            if (startSecs) {
                                var seconds = hmsToSeconds(startSecs);
                                params.push('start=' + seconds);
                            }
                        }

                        if (this.data.chkPrivacy) {
                            domen = 'www.youtube-nocookie.com/';
                        } else {
                            domen = 'www.youtube.com/';
                        }

                        if (this.data.chkRelated) {
                            params.push('rel=0');
                        }

                        if (this.data.chkControls) {
                            params.push('controls=0');
                        }

                        if (this.data.mute) {
                            params.push('mute=1');
                        }

                        if (this.data.loop) {
                            params.push('loop=1&playlist=' + video_id);
                        }

                        url = 'https://' + domen + 'embed/' + video_id;
                        if (params.length > 0) {
                            url = url + '?' + params.join('&');
                        }
                    }

                    if ( !this.data.isFancybox ) {

                        // video-container (iframe)
                        this.element.getChild( 0 ).removeClass('img-fluid');
                        this.element.getChild( 0 ).removeAttribute('alt');
                        this.element.removeAttribute('href');

                        this.element.getChild( 0 ).setAttribute('title', "YouTube video player");
                        this.element.getChild( 0 ).setAttribute('allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
                        this.element.getChild( 0 ).setAttribute('allowfullscreen', "");

                        this.element.getChild(0).setAttribute('data-src', url);
                        this.element.getChild(0).removeAttribute('src');

                    } else {

                        // video-container-fancybox (img preview)
                        this.element.getChild( 0 ).addClass('img-fluid');

                        if(this.data.altThumbnail){
                            this.element.getChild(0).setAttribute('alt', this.data.altThumbnail);
                        } else {
                            this.element.getChild(0).setAttribute('alt', "");
                        }

                        this.element.removeAttribute( 'data-cke-saved-href' );
                        this.element.setAttribute('href', url);

                        var url_thumbnail = 'https://img.youtube.com/vi/' + video_id + '/' + this.data.thumbnail_size + '.jpg';

                        this.element.getChild( 0 ).removeAttribute('title');
                        this.element.getChild( 0 ).removeAttribute('allow');
                        this.element.getChild( 0 ).removeAttribute('allowfullscreen');

                        this.element.getChild(0).setAttribute('data-src', url_thumbnail);
                        this.element.getChild(0).setAttribute('src', "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='" + video_container_fancybox_max_width + "'%20viewBox='0%200%20" + video_container_fancybox_max_width + "%20" + video_container_fancybox_max_height + "'%3E%3C/svg%3E");
                    }

                }

            }
        } );

        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'youtubeGroup' );
            editor.addMenuItem( 'youtubePropertiesItem', {
                label: editor.lang.youtube.videoProperties,
                icon: 'youtube',
                command: 'youtube',
                group: 'youtubeGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element &&
                     element.getChild( 0 ) &&
                     element.getChild( 0 ).hasClass &&
                    ( element.getChild( 0 ).hasClass( 'video-container' ) || element.getChild( 0 ).hasClass( 'video-container-fancybox' ) )  ) {
                    return { youtubePropertiesItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

        CKEDITOR.dialog.add( 'youtube', this.path + 'dialogs/youtube.js' );
    }
} );

/**
 * youtube_parser
*/
function youtube_parser(url){
    /*
     Взято отсюда:
     https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
     Если ссылка содержит:
     http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
     http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
     http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
     http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
     http://www.youtube.com/embed/0zM3nApSvMg?rel=0
     http://www.youtube.com/watch?v=0zM3nApSvMg
     http://youtu.be/0zM3nApSvMg
    */

    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

/**
 * Converts time in hms format to seconds only
 */
function hmsToSeconds(time) {
    var arr = time.split(':'), s = 0, m = 1;

    while (arr.length > 0) {
        s += m * parseInt(arr.pop(), 10);
        m *= 60;
    }

    return s;
}

/**
 * Converts seconds to hms format
 */
function secondsToHms(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds / 60) % 60);
    var s = seconds % 60;

    var pad = function (n) {
        n = String(n);
        return n.length >= 2 ? n : "0" + n;
    };

    if (h > 0) {
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    }
    else {
        return pad(m) + ':' + pad(s);
    }
}

/**
 * get value parameters into url
 */
function getParam( name, src )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( src );
    if( results == null )
        return "";
    else
        return results[1];
}
