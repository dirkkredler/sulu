define(["config","./cropping-slide","./focus-point-slide","services/sulumedia/media-manager","services/sulumedia/file-icons","services/sulumedia/image-editor","text!./info.html","text!./copyright.html","text!./versions.html","text!./preview.html","text!./formats.html","text!./categories.html"],function(a,b,c,d,e,f,g,h,i,j,k,l){"use strict";var m="sulu.media-edit.",n={instanceName:"",startingSlide:"edit",formats:[]},o={thumbnailFormat:"260x",formSelector:"#media-form",multipleEditFormSelector:"#media-multiple-edit",fileDropzoneSelector:"#file-version-change",previewDropzoneSelector:"#preview-image-change",multipleEditDescSelector:".media-description",multipleEditTagsSelector:".media-tags",descriptionCheckboxSelector:"#show-descriptions",tagsCheckboxSelector:"#show-tags",previewSelector:".media-edit-preview-image",previewLoaderSelector:".media-edit-preview-loader",previewLoaderHintSelector:".media-edit-preview-loader .hint",previewImgSelector:".media-edit-preview-image img",singleEditClass:"single-edit",multiEditClass:"multi-edit",loadingClass:"loading",loaderClass:"media-edit-loader",resetPreviewActionClass:"media-reset-preview-action",previewImageLoaderDuration:3e3,singleOverlaySkin:"large",multipleOverlaySkin:"medium"},p=a.get("sulu-media").formats,q=Object.keys(p).reduce(function(a,b){return p[b].internal||(a[b]=p[b]),a},{}),r=function(a){return"/admin/api/media/"+a+"/preview"},s=function(){return v.call(this,"closed")},t=function(){return v.call(this,"initialized")},u=function(){return v.call(this,"preview.loading")},v=function(a){return m+(this.options.instanceName?this.options.instanceName+".":"")+a};return{templates:["/admin/media/template/media/multiple-edit"],initialize:function(){var a;if(this.options=this.sandbox.util.extend(!0,{locale:this.sandbox.sulu.getDefaultContentLocale()},n,this.options),!this.options.mediaIds)throw new Error("media-ids are not defined");this.imageFormats=q,a=this.options.formats.length,a>0&&(this.imageFormats=Object.keys(q).reduce(function(b,c){for(var d=0;a>d;++d)if(this.options.formats[d]===q[c].key)return b[c]=q[c],b;return b}.bind(this),{})),this.options.previewInitialized=!1,this.media=null,this.loaderTimeout=null,this.medias=null,this.$multiple=null,this.startLoadingOverlay(this.options.mediaIds.length>1),this.loadMedias(this.options.mediaIds,this.options.locale).then(function(a){this.editMedia(a)}.bind(this)),this.sandbox.emit(t.call(this))},startLoadingOverlay:function(a){var b=this.sandbox.dom.createElement('<div class="'+o.loadingClass+'"/>'),c=this.sandbox.dom.createElement('<div class="'+o.loaderClass+'" />');this.sandbox.dom.append(this.$el,b),this.sandbox.once("husky.overlay.media-edit.loading.opened",function(){this.sandbox.start([{name:"loader@husky",options:{el:c,size:"100px",color:"#cccccc"}}])}.bind(this)),this.sandbox.start([{name:"overlay@husky",options:{el:b,title:this.sandbox.translate("sulu.media.edit.loading"),data:c,skin:a?o.multipleOverlaySkin:o.singleOverlaySkin,openOnStart:!0,removeOnClose:!0,instanceName:"media-edit.loading",closeIcon:"",okInactive:!0,propagateEvents:!1}}])},loadMedias:function(a,b){var c=[],e=$.Deferred(),f=[];return a.forEach(function(a){var e=d.loadOrNew(a,b);c.push(e),e.then(function(a){f.push(a)}.bind(this))}.bind(this)),$.when.apply(null,c).then(function(){e.resolve(f)}.bind(this)),e},editMedia:function(a){1===a.length?this.editSingleMedia(a[0]):a.length>1&&this.editMultipleMedia(a)},editSingleMedia:function(a){var b,c,d,f,m,n,p,r,s;this.media=a,p=e.getByMimeType(a.mimeType),b=this.sandbox.dom.createElement(_.template(g,{media:this.media,translate:this.sandbox.translate,icon:p,thumbnailFormat:o.thumbnailFormat})),this.removePlaceholderOnImgLoad(b,p),c=this.sandbox.dom.createElement(_.template(h,{media:this.media,translate:this.sandbox.translate})),"image"!==a.type.name&&(f=this.sandbox.dom.createElement(_.template(j,{media:this.media,translate:this.sandbox.translate}))),d=this.sandbox.dom.createElement(_.template(i,{media:this.media,translate:this.sandbox.translate})),r=Object.keys(q).reduce(function(a,b){return a[b]=this.media.thumbnails[b],a}.bind(this),{}),s=Object.keys(q).reduce(function(a,b){var c=q[b];return a[b]=null,c&&c.meta&&c.meta.title&&(a[b]=c.meta.title[this.sandbox.sulu.user.locale]),a}.bind(this),{}),m=this.sandbox.dom.createElement(_.template(k,{media:this.media,formatUrls:r,formatTitles:s,domain:window.location.protocol+"//"+window.location.host,translate:this.sandbox.translate})),n=this.sandbox.dom.createElement(_.template(l,{categoryLocale:this.options.locale,media:this.media,translate:this.sandbox.translate})),this.startSingleOverlay(b,c,m,d,f,n)},startSingleOverlay:function(a,d,e,f,g,h){var i,j=this.sandbox.dom.createElement('<div class="'+o.singleEditClass+'" id="media-form"/>'),k=0;this.sandbox.dom.append(this.$el,j),this.bindSingleOverlayEvents();var l=[{title:this.sandbox.translate("public.info"),data:a},{title:this.sandbox.translate("sulu.media.licence"),data:d}];g&&l.push({title:this.sandbox.translate("sulu.media.preview-tab"),data:g}),l.push({title:this.sandbox.translate("sulu.media.formats"),data:e}),l.push({title:this.sandbox.translate("sulu.media.categories"),data:h}),l.push({title:this.sandbox.translate("sulu.media.history"),data:f}),"image"===this.media.type.name&&(i=$('<div class="edit-action-select"/>'),b.initialize(this.$el,this.sandbox,this.media,this.imageFormats,function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",0)}.bind(this)),c.initialize(this.sandbox,this.media,function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",0)}.bind(this)),k="crop"===this.options.startingSlide?1:k),this.sandbox.start([{name:"overlay@husky",options:{el:j,openOnStart:!0,removeOnClose:!0,instanceName:"media-edit",skin:o.singleOverlaySkin,startingSlide:k,supportKeyInput:!1,slides:[{title:this.media.title,subTitle:this.sandbox.util.cropMiddle(this.media.mimeType+", "+this.sandbox.util.formatBytes(this.media.size),32),tabs:l,languageChanger:{locales:this.sandbox.sulu.locales,preSelected:this.options.locale},panelContent:i,propagateEvents:!1,okCallback:this.singleOkCallback.bind(this),cancelCallback:function(){this.sandbox.stop()}.bind(this),buttons:[{type:"cancel",inactive:!1,text:"public.cancel",align:"left"},{classes:"just-text "+o.resetPreviewActionClass,inactive:!1,text:"sulu.media.reset-preview-image",align:"center",callback:function(){return this.resetPreviewImage.call(this),!1}.bind(this)},{type:"ok",inactive:!1,text:"public.ok",align:"right"}]},b.getSlideDefinition(),c.getSlideDefinition()]}}]).then(function(){"image"===this.media.type.name&&(this.startEditActionSelect(i),b.start(),c.start())}.bind(this))},startEditActionSelect:function(a){var b={data:[{name:this.sandbox.translate("sulu-media.crop"),callback:function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",1)}.bind(this)},{name:this.sandbox.translate("sulu-media.focus-point"),callback:function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",2)}.bind(this)}]};f.editingIsPossible()&&b.data.push({name:this.sandbox.translate("sulu-media.edit-original"),callback:function(){this.sandbox.sulu.showConfirmationDialog({title:"sulu-media.external-server-title",description:"sulu-media.external-server-description",callback:function(a){a&&f.editImage(this.media.url).then(this.setNewVersionByUrl.bind(this))}.bind(this)})}.bind(this)}),this.sandbox.start([{name:"select@husky",options:this.sandbox.util.extend(!0,{},{el:a,defaultLabel:this.sandbox.translate("sulu-media.edit-image"),instanceName:"edit-action-select",fixedLabel:!0,skin:"white-border",icon:"paint-brush",repeatSelect:!0},b)}])},removePlaceholderOnImgLoad:function(a,b){var c=a.find(o.previewImgSelector);c.length&&(c.hide(),c.load(function(){c.show(),c.parent().removeClass(b)}.bind(this)))},singleOkCallback:function(){return this.sandbox.form.validate(o.formSelector)?(this.saveSingleMedia(),void this.sandbox.stop()):!1},bindSingleOverlayEvents:function(){this.sandbox.once("husky.overlay.media-edit.opened",function(){this.sandbox.form.create(o.formSelector).initialized.then(function(){this.sandbox.form.setData(o.formSelector,this.media).then(function(){this.sandbox.start(o.formSelector),this.sandbox.dom.addClass($("."+o.resetPreviewActionClass),"hide"),this.startSingleDropzone()}.bind(this))}.bind(this))}.bind(this)),this.sandbox.once("husky.overlay.media-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.once("husky.overlay.media-edit.opened",function(){this.clipboard=this.sandbox.clipboard.initialize(".fa-clipboard"),this.sandbox.emit("husky.overlay.alert.close")}.bind(this)),this.sandbox.on("husky.tabs.overlaymedia-edit.item.select",function(a){var b=$("."+o.resetPreviewActionClass);"media-preview"===a.$el[0].id?(this.options.previewInitialized||(this.startPreviewDropzone(),this.options.previewInitialized=!0),this.sandbox.dom.removeClass(b,"hide")):this.sandbox.dom.addClass(b,"hide")}.bind(this)),this.sandbox.once("husky.overlay.media-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.on("husky.overlay.media-edit.language-changed",this.languageChangedSingle.bind(this)),this.sandbox.dom.on(this.$el,"click",function(a){var b=$(a.currentTarget),c=b.parents(".media-edit-link"),d=b.siblings(".media-edit-copied");c.addClass("highlight-animation"),b.hide(),d.show(),_.delay(function(a,b,c){b.removeClass("highlight-animation"),c.hide(),a.show()},2e3,b,c,d)}.bind(this),".fa-clipboard"),this.sandbox.on("husky.dropzone.file-version.uploading",function(){this.sandbox.emit("husky.overlay.alert.close")}.bind(this)),this.sandbox.on("husky.dropzone.file-version.files-added",this.newVersionUploadedHandler.bind(this)),this.sandbox.on("husky.dropzone.preview-image.files-added",this.previewImageChangeHandler.bind(this)),this.sandbox.on(u.call(this),this.startPreviewImageLoader.bind(this))},unbindSingleOverlayEvents:function(){this.sandbox.off("husky.overlay.media-edit.language-changed"),this.sandbox.off("husky.tabs.overlaymedia-edit.item.select"),this.sandbox.off("husky.dropzone.file-version.files-added"),this.sandbox.off("husky.dropzone.preview-image.files-added")},languageChangedSingle:function(a){this.saveSingleMedia().then(function(){b.destroy(),this.sandbox.stop(this.$find("*")),this.options.locale=a,this.unbindSingleOverlayEvents(),this.initialize()}.bind(this))},setNewVersionByUrl:function(a){this.sandbox.sulu.showConfirmationDialog({title:"sulu-media.new-version-will-be-created",description:"sulu-media.new-version-will-be-created-description",callback:function(b){return b?(this.sandbox.emit("husky.overlay.alert.show-loader"),this.sandbox.emit("husky.dropzone.file-version.add-image",a,this.media.mimeType,this.media.name),!1):void 0}.bind(this)})},newVersionUploadedHandler:function(a){a[0]&&(this.sandbox.emit("sulu.medias.media.saved",a[0].id,a[0]),this.sandbox.emit("sulu.labels.success.show","labels.success.media-save-desc"),b.destroy(),this.sandbox.stop(this.$find("*")),this.unbindSingleOverlayEvents(),this.initialize())},previewImageChangeHandler:function(){var a=this.media.id;d.loadOrNew(a,this.options.locale).then(function(a){this.sandbox.emit("sulu.medias.media.saved",a.id,a),this.sandbox.emit("sulu.labels.success.show","labels.success.media-save-desc"),b.destroy(),this.sandbox.stop(this.$find("*")),this.unbindSingleOverlayEvents(),this.initialize()}.bind(this))},startPreviewImageLoader:function(a){this.showPreviewImageLoader(a),this.sandbox.once("husky.overlay.media-edit.slide-to",function(){this.loaderTimeout=setTimeout(function(){this.hidePreviewImageLoader(),this.loaderTimeout=null}.bind(this),o.previewImageLoaderDuration)},this)},showPreviewImageLoader:function(a){$(o.previewSelector).hide(),$(o.previewLoaderSelector).show(),$(o.previewLoaderHintSelector).text(a)},hidePreviewImageLoader:function(){$(o.previewSelector).show(),$(o.previewLoaderSelector).hide(),$(o.previewLoaderHintSelector).text("")},saveSingleMedia:function(){var a=$.Deferred();if(this.sandbox.form.validate(o.formSelector)){var b=this.sandbox.form.getData(o.formSelector),c=this.sandbox.util.extend(!1,{},this.media,b);JSON.stringify(this.media)!==JSON.stringify(c)?d.save(c).then(function(){a.resolve()}):a.resolve()}else a.resolve();return a},startSingleDropzone:function(){this.sandbox.start([{name:"dropzone@husky",options:{el:o.fileDropzoneSelector,maxFilesize:a.get("sulu-media").maxFilesize,url:"/admin/api/media/"+this.media.id+"?action=new-version&locale="+this.options.locale,method:"POST",paramName:"fileVersion",showOverlay:!1,skin:"overlay",titleKey:"",descriptionKey:"sulu.media.upload-new-version",instanceName:"file-version",maxFiles:1}}])},startPreviewDropzone:function(){this.sandbox.start([{name:"dropzone@husky",options:{el:o.previewDropzoneSelector,maxFilesize:a.get("sulu-media").maxFilesize,url:"/admin/api/media/"+this.media.id+"/preview",method:"POST",paramName:"previewImage",showOverlay:!1,skin:"overlay",titleKey:"",descriptionKey:"sulu.media.upload-new-preview",instanceName:"preview-image",maxFiles:1}}])},editMultipleMedia:function(a){this.medias=a,this.$multiple=this.sandbox.dom.createElement(this.renderTemplate("/admin/media/template/media/multiple-edit")),this.startMultipleEditOverlay()},startMultipleEditOverlay:function(){var a=this.sandbox.dom.createElement('<div class="'+o.multiEditClass+'"/>');this.sandbox.dom.append(this.$el,a),this.bindMultipleOverlayEvents(),this.sandbox.start([{name:"overlay@husky",options:{el:a,title:this.sandbox.translate("sulu.media.multiple-edit.title"),data:this.$multiple,skin:o.multipleOverlaySkin,languageChanger:{locales:this.sandbox.sulu.locales,preSelected:this.options.locale},openOnStart:!0,removeOnClose:!0,closeIcon:"",instanceName:"media-multiple-edit",propagateEvents:!1,okCallback:this.multipleOkCallback.bind(this),cancelCallback:function(){this.sandbox.stop()}.bind(this)}}])},multipleOkCallback:function(){return this.sandbox.form.validate(o.multipleEditFormSelector)?(this.saveMultipleMedia(),void this.sandbox.stop()):!1},languageChangedMultiple:function(a){this.saveMultipleMedia().then(function(){this.sandbox.stop(this.$find("*")),this.options.locale=a,this.unbindMultipleOverlayEvents(),this.initialize()}.bind(this))},bindMultipleOverlayEvents:function(){this.sandbox.once("husky.overlay.media-multiple-edit.opened",function(){this.sandbox.form.create(o.multipleEditFormSelector).initialized.then(function(){this.sandbox.form.setData(o.multipleEditFormSelector,{records:this.medias}).then(function(){this.sandbox.start(o.multipleEditFormSelector)}.bind(this))}.bind(this))}.bind(this)),this.sandbox.once("husky.overlay.media-multiple-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.dom.on(this.sandbox.dom.find(o.descriptionCheckboxSelector,this.$multiple),"change",this.toggleDescriptions.bind(this)),this.sandbox.dom.on(this.sandbox.dom.find(o.tagsCheckboxSelector,this.$multiple),"change",this.toggleTags.bind(this)),this.sandbox.on("husky.overlay.media-multiple-edit.language-changed",this.languageChangedMultiple.bind(this))},unbindMultipleOverlayEvents:function(){this.sandbox.off("husky.overlay.media-multiple-edit.language-changed")},toggleDescriptions:function(){var a=this.sandbox.dom.is(this.sandbox.dom.find(o.descriptionCheckboxSelector,this.$multiple),":checked"),b=this.sandbox.dom.find(o.multipleEditDescSelector,this.$multiple);a===!0?this.sandbox.dom.removeClass(b,"hidden"):this.sandbox.dom.addClass(b,"hidden")},toggleTags:function(){var a=this.sandbox.dom.is(this.sandbox.dom.find(o.tagsCheckboxSelector,this.$multiple),":checked"),b=this.sandbox.dom.find(o.multipleEditTagsSelector,this.$multiple);a===!0?this.sandbox.dom.removeClass(b,"hidden"):this.sandbox.dom.addClass(b,"hidden")},saveMultipleMedia:function(){var a=$.Deferred();if(this.sandbox.form.validate(o.multipleEditFormSelector)){var b=this.sandbox.form.getData(o.multipleEditFormSelector),c=[];this.sandbox.util.foreach(this.medias,function(a,e){var f=this.sandbox.util.extend(!1,{},a,b.records[e]);JSON.stringify(a)!==JSON.stringify(f)&&c.push(d.save(f))}.bind(this)),$.when.apply(null,c).then(function(){a.resolve()}.bind(this))}else a.resolve();return a},resetPreviewImage:function(){var a=this.media.id;$.ajax({url:r(a),type:"DELETE",success:function(){this.previewImageChangeHandler.call(this)}.bind(this)})},destroy:function(){this.loaderTimeout&&(clearTimeout(this.loaderTimeout),this.loaderTimeout=null),this.sandbox.emit(s.call(this))}}});