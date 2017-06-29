!function($,e,t){var a=$(document);e=e||{},e.updates={},e.updates.ajaxNonce=t.ajax_nonce,e.updates.l10n=t.l10n,e.updates.searchTerm="",e.updates.shouldRequestFilesystemCredentials=!1,e.updates.filesystemCredentials={ftp:{host:"",username:"",password:"",connectionType:""},ssh:{publicKey:"",privateKey:""},fsNonce:"",available:!1},e.updates.ajaxLocked=!1,e.updates.adminNotice=e.template("wp-updates-admin-notice"),e.updates.queue=[],e.updates.$elToReturnFocusToFromCredentialsModal=void 0,e.updates.addAdminNotice=function(t){var s=$(t.selector),n;delete t.selector,n=e.updates.adminNotice(t),s.length||(s=$("#"+t.id)),s.length?s.replaceWith(n):$(".wrap").find("> h1").after(n),a.trigger("wp-updates-notice-added")},e.updates.ajax=function(t,a){var s={};return e.updates.ajaxLocked?(e.updates.queue.push({action:t,data:a}),$.Deferred()):(e.updates.ajaxLocked=!0,a.success&&(s.success=a.success,delete a.success),a.error&&(s.error=a.error,delete a.error),s.data=_.extend(a,{action:t,_ajax_nonce:e.updates.ajaxNonce,_fs_nonce:e.updates.filesystemCredentials.fsNonce,username:e.updates.filesystemCredentials.ftp.username,password:e.updates.filesystemCredentials.ftp.password,hostname:e.updates.filesystemCredentials.ftp.hostname,connection_type:e.updates.filesystemCredentials.ftp.connectionType,public_key:e.updates.filesystemCredentials.ssh.publicKey,private_key:e.updates.filesystemCredentials.ssh.privateKey}),e.ajax.send(s).always(e.updates.ajaxAlways))},e.updates.ajaxAlways=function(t){t.errorCode&&"unable_to_connect_to_filesystem"===t.errorCode||(e.updates.ajaxLocked=!1,e.updates.queueChecker()),void 0!==t.debug&&window.console&&window.console.log&&_.map(t.debug,function(e){window.console.log($("<p />").html(e).text())})},e.updates.refreshCount=function(){var e=$("#wp-admin-bar-updates"),a=$('a[href="update-core.php"] .update-plugins'),s=$('a[href="plugins.php"] .update-plugins'),n=$('a[href="themes.php"] .update-plugins'),l;e.find(".ab-item").removeAttr("title"),e.find(".ab-label").text(t.totals.counts.total),0===t.totals.counts.total&&e.find(".ab-label").parents("li").remove(),a.each(function(e,a){a.className=a.className.replace(/count-\d+/,"count-"+t.totals.counts.total)}),t.totals.counts.total>0?a.find(".update-count").text(t.totals.counts.total):a.remove(),s.each(function(e,a){a.className=a.className.replace(/count-\d+/,"count-"+t.totals.counts.plugins)}),t.totals.counts.total>0?s.find(".plugin-count").text(t.totals.counts.plugins):s.remove(),n.each(function(e,a){a.className=a.className.replace(/count-\d+/,"count-"+t.totals.counts.themes)}),t.totals.counts.total>0?n.find(".theme-count").text(t.totals.counts.themes):n.remove(),"plugins"===pagenow||"plugins-network"===pagenow?l=t.totals.counts.plugins:"themes"!==pagenow&&"themes-network"!==pagenow||(l=t.totals.counts.themes),l>0?$(".subsubsub .upgrade .count").text("("+l+")"):$(".subsubsub .upgrade").remove()},e.updates.decrementCount=function(a){t.totals.counts.total=Math.max(--t.totals.counts.total,0),"plugin"===a?t.totals.counts.plugins=Math.max(--t.totals.counts.plugins,0):"theme"===a&&(t.totals.counts.themes=Math.max(--t.totals.counts.themes,0)),e.updates.refreshCount(a)},e.updates.updatePlugin=function(t){var s,n,l,i;return t=_.extend({success:e.updates.updatePluginSuccess,error:e.updates.updatePluginError},t),"plugins"===pagenow||"plugins-network"===pagenow?(s=$('tr[data-plugin="'+t.plugin+'"]'),l=s.find(".update-message").removeClass("notice-error").addClass("updating-message notice-warning").find("p"),i=e.updates.l10n.updatingLabel.replace("%s",s.find(".plugin-title strong").text())):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(n=$(".plugin-card-"+t.slug),l=n.find(".update-now").addClass("updating-message"),i=e.updates.l10n.updatingLabel.replace("%s",l.data("name")),n.removeClass("plugin-card-update-failed").find(".notice.notice-error").remove()),l.html()!==e.updates.l10n.updating&&l.data("originaltext",l.html()),l.attr("aria-label",i).text(e.updates.l10n.updating),a.trigger("wp-plugin-updating",t),e.updates.ajax("update-plugin",t)},e.updates.updatePluginSuccess=function(t){var s,n,l;"plugins"===pagenow||"plugins-network"===pagenow?(s=$('tr[data-plugin="'+t.plugin+'"]').removeClass("update").addClass("updated"),n=s.find(".update-message").removeClass("updating-message notice-warning").addClass("updated-message notice-success").find("p"),l=s.find(".plugin-version-author-uri").html().replace(t.oldVersion,t.newVersion),s.find(".plugin-version-author-uri").html(l)):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(n=$(".plugin-card-"+t.slug).find(".update-now").removeClass("updating-message").addClass("button-disabled updated-message")),n.attr("aria-label",e.updates.l10n.updatedLabel.replace("%s",t.pluginName)).text(e.updates.l10n.updated),e.a11y.speak(e.updates.l10n.updatedMsg,"polite"),e.updates.decrementCount("plugin"),a.trigger("wp-plugin-update-success",t)},e.updates.updatePluginError=function(t){var s,n,l;e.updates.isValidResponse(t,"update")&&(e.updates.maybeHandleCredentialError(t,"update-plugin")||(l=e.updates.l10n.updateFailed.replace("%s",t.errorMessage),"plugins"===pagenow||"plugins-network"===pagenow?(n=t.plugin?$('tr[data-plugin="'+t.plugin+'"]').find(".update-message"):$('tr[data-slug="'+t.slug+'"]').find(".update-message"),n.removeClass("updating-message notice-warning").addClass("notice-error").find("p").html(l),t.pluginName?n.find("p").attr("aria-label",e.updates.l10n.updateFailedLabel.replace("%s",t.pluginName)):n.find("p").removeAttr("aria-label")):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(s=$(".plugin-card-"+t.slug).addClass("plugin-card-update-failed").append(e.updates.adminNotice({className:"update-message notice-error notice-alt is-dismissible",message:l})),s.find(".update-now").text(e.updates.l10n.updateFailedShort).removeClass("updating-message"),t.pluginName?s.find(".update-now").attr("aria-label",e.updates.l10n.updateFailedLabel.replace("%s",t.pluginName)):s.find(".update-now").removeAttr("aria-label"),s.on("click",".notice.is-dismissible .notice-dismiss",function(){setTimeout(function(){s.removeClass("plugin-card-update-failed").find(".column-name a").focus(),s.find(".update-now").attr("aria-label",!1).text(e.updates.l10n.updateNow)},200)})),e.a11y.speak(l,"assertive"),a.trigger("wp-plugin-update-error",t)))},e.updates.installPlugin=function(t){var s=$(".plugin-card-"+t.slug),n=s.find(".install-now");return t=_.extend({success:e.updates.installPluginSuccess,error:e.updates.installPluginError},t),"import"===pagenow&&(n=$('[data-slug="'+t.slug+'"]')),n.html()!==e.updates.l10n.installing&&n.data("originaltext",n.html()),n.addClass("updating-message").attr("aria-label",e.updates.l10n.pluginInstallingLabel.replace("%s",n.data("name"))).text(e.updates.l10n.installing),e.a11y.speak(e.updates.l10n.installingMsg,"polite"),s.removeClass("plugin-card-install-failed").find(".notice.notice-error").remove(),a.trigger("wp-plugin-installing",t),e.updates.ajax("install-plugin",t)},e.updates.installPluginSuccess=function(t){var s=$(".plugin-card-"+t.slug).find(".install-now");s.removeClass("updating-message").addClass("updated-message installed button-disabled").attr("aria-label",e.updates.l10n.pluginInstalledLabel.replace("%s",t.pluginName)).text(e.updates.l10n.installed),e.a11y.speak(e.updates.l10n.installedMsg,"polite"),a.trigger("wp-plugin-install-success",t),t.activateUrl&&setTimeout(function(){s.removeClass("install-now installed button-disabled updated-message").addClass("activate-now button-primary").attr("href",t.activateUrl).attr("aria-label",e.updates.l10n.activatePluginLabel.replace("%s",t.pluginName)).text(e.updates.l10n.activatePlugin)},1e3)},e.updates.installPluginError=function(t){var s=$(".plugin-card-"+t.slug),n=s.find(".install-now"),l;e.updates.isValidResponse(t,"install")&&(e.updates.maybeHandleCredentialError(t,"install-plugin")||(l=e.updates.l10n.installFailed.replace("%s",t.errorMessage),s.addClass("plugin-card-update-failed").append('<div class="notice notice-error notice-alt is-dismissible"><p>'+l+"</p></div>"),s.on("click",".notice.is-dismissible .notice-dismiss",function(){setTimeout(function(){s.removeClass("plugin-card-update-failed").find(".column-name a").focus()},200)}),n.removeClass("updating-message").addClass("button-disabled").attr("aria-label",e.updates.l10n.pluginInstallFailedLabel.replace("%s",n.data("name"))).text(e.updates.l10n.installFailedShort),e.a11y.speak(l,"assertive"),a.trigger("wp-plugin-install-error",t)))},e.updates.installImporterSuccess=function(t){e.updates.addAdminNotice({id:"install-success",className:"notice-success is-dismissible",message:e.updates.l10n.importerInstalledMsg.replace("%s",t.activateUrl+"&from=import")}),$('[data-slug="'+t.slug+'"]').removeClass("install-now updating-message").addClass("activate-now").attr({href:t.activateUrl+"&from=import","aria-label":e.updates.l10n.activateImporterLabel.replace("%s",t.pluginName)}).text(e.updates.l10n.activateImporter),e.a11y.speak(e.updates.l10n.installedMsg,"polite"),a.trigger("wp-importer-install-success",t)},e.updates.installImporterError=function(t){var s=e.updates.l10n.installFailed.replace("%s",t.errorMessage),n=$('[data-slug="'+t.slug+'"]'),l=n.data("name");e.updates.isValidResponse(t,"install")&&(e.updates.maybeHandleCredentialError(t,"install-plugin")||(e.updates.addAdminNotice({id:t.errorCode,className:"notice-error is-dismissible",message:s}),n.removeClass("updating-message").text(e.updates.l10n.installNow).attr("aria-label",e.updates.l10n.installNowLabel.replace("%s",l)),e.a11y.speak(s,"assertive"),a.trigger("wp-importer-install-error",t)))},e.updates.deletePlugin=function(t){var s=$('[data-plugin="'+t.plugin+'"]').find(".row-actions a.delete");return t=_.extend({success:e.updates.deletePluginSuccess,error:e.updates.deletePluginError},t),s.html()!==e.updates.l10n.deleting&&s.data("originaltext",s.html()).text(e.updates.l10n.deleting),e.a11y.speak(e.updates.l10n.deleting,"polite"),a.trigger("wp-plugin-deleting",t),e.updates.ajax("delete-plugin",t)},e.updates.deletePluginSuccess=function(s){$('[data-plugin="'+s.plugin+'"]').css({backgroundColor:"#faafaa"}).fadeOut(350,function(){var a=$("#bulk-action-form"),n=$(".subsubsub"),l=$(this),i=a.find("thead th:not(.hidden), thead td").length,d=e.template("item-deleted-row"),u=t.plugins;l.hasClass("plugin-update-tr")||l.after(d({slug:s.slug,plugin:s.plugin,colspan:i,name:s.pluginName})),l.remove(),-1!==_.indexOf(u.upgrade,s.plugin)&&(u.upgrade=_.without(u.upgrade,s.plugin),e.updates.decrementCount("plugin")),-1!==_.indexOf(u.inactive,s.plugin)&&(u.inactive=_.without(u.inactive,s.plugin),u.inactive.length?n.find(".inactive .count").text("("+u.inactive.length+")"):n.find(".inactive").remove()),-1!==_.indexOf(u.active,s.plugin)&&(u.active=_.without(u.active,s.plugin),u.active.length?n.find(".active .count").text("("+u.active.length+")"):n.find(".active").remove()),-1!==_.indexOf(u.recently_activated,s.plugin)&&(u.recently_activated=_.without(u.recently_activated,s.plugin),u.recently_activated.length?n.find(".recently_activated .count").text("("+u.recently_activated.length+")"):n.find(".recently_activated").remove()),u.all=_.without(u.all,s.plugin),u.all.length?n.find(".all .count").text("("+u.all.length+")"):(a.find(".tablenav").css({visibility:"hidden"}),n.find(".all").remove(),a.find("tr.no-items").length||a.find("#the-list").append('<tr class="no-items"><td class="colspanchange" colspan="'+i+'">'+e.updates.l10n.noPlugins+"</td></tr>"))}),e.a11y.speak(e.updates.l10n.deleted,"polite"),a.trigger("wp-plugin-delete-success",s)},e.updates.deletePluginError=function(t){var s,n,l=e.template("item-update-row"),i=e.updates.adminNotice({className:"update-message notice-error notice-alt",message:t.errorMessage});t.plugin?(s=$('tr.inactive[data-plugin="'+t.plugin+'"]'),n=s.siblings('[data-plugin="'+t.plugin+'"]')):(s=$('tr.inactive[data-slug="'+t.slug+'"]'),n=s.siblings('[data-slug="'+t.slug+'"]')),e.updates.isValidResponse(t,"delete")&&(e.updates.maybeHandleCredentialError(t,"delete-plugin")||(n.length?(n.find(".notice-error").remove(),n.find(".plugin-update").append(i)):s.addClass("update").after(l({slug:t.slug,plugin:t.plugin||t.slug,colspan:$("#bulk-action-form").find("thead th:not(.hidden), thead td").length,content:i})),a.trigger("wp-plugin-delete-error",t)))},e.updates.updateTheme=function(t){var s;return t=_.extend({success:e.updates.updateThemeSuccess,error:e.updates.updateThemeError},t),"themes-network"===pagenow?s=$('[data-slug="'+t.slug+'"]').find(".update-message").removeClass("notice-error").addClass("updating-message notice-warning").find("p"):(s=$("#update-theme").closest(".notice").removeClass("notice-large"),s.find("h3").remove(),s=s.add($('[data-slug="'+t.slug+'"]').find(".update-message")),s=s.addClass("updating-message").find("p")),s.html()!==e.updates.l10n.updating&&s.data("originaltext",s.html()),e.a11y.speak(e.updates.l10n.updatingMsg,"polite"),s.text(e.updates.l10n.updating),a.trigger("wp-theme-updating",t),e.updates.ajax("update-theme",t)},e.updates.updateThemeSuccess=function(t){var s=$("body.modal-open").length,n=$('[data-slug="'+t.slug+'"]'),l={className:"updated-message notice-success notice-alt",message:e.updates.l10n.updated},i,d;"themes-network"===pagenow?(i=n.find(".update-message"),d=n.find(".theme-version-author-uri").html().replace(t.oldVersion,t.newVersion),n.find(".theme-version-author-uri").html(d)):(i=$(".theme-info .notice").add(n.find(".update-message")),s?$(".load-customize:visible").focus():n.find(".load-customize").focus()),e.updates.addAdminNotice(_.extend({selector:i},l)),e.a11y.speak(e.updates.l10n.updatedMsg,"polite"),e.updates.decrementCount("theme"),a.trigger("wp-theme-update-success",t),s&&$(".theme-info .theme-author").after(e.updates.adminNotice(l))},e.updates.updateThemeError=function(t){var s=$('[data-slug="'+t.slug+'"]'),n=e.updates.l10n.updateFailed.replace("%s",t.errorMessage),l;e.updates.isValidResponse(t,"update")&&(e.updates.maybeHandleCredentialError(t,"update-theme")||("themes-network"===pagenow?l=s.find(".update-message "):(l=$(".theme-info .notice").add(s.find(".notice")),$("body.modal-open").length?$(".load-customize:visible").focus():s.find(".load-customize").focus()),e.updates.addAdminNotice({selector:l,className:"update-message notice-error notice-alt is-dismissible",message:n}),e.a11y.speak(n,"polite"),a.trigger("wp-theme-update-error",t)))},e.updates.installTheme=function(t){var s=$('.theme-install[data-slug="'+t.slug+'"]');return t=_.extend({success:e.updates.installThemeSuccess,error:e.updates.installThemeError},t),s.addClass("updating-message"),s.parents(".theme").addClass("focus"),s.html()!==e.updates.l10n.installing&&s.data("originaltext",s.html()),s.text(e.updates.l10n.installing).attr("aria-label",e.updates.l10n.themeInstallingLabel.replace("%s",s.data("name"))),e.a11y.speak(e.updates.l10n.installingMsg,"polite"),$('.install-theme-info, [data-slug="'+t.slug+'"]').removeClass("theme-install-failed").find(".notice.notice-error").remove(),a.trigger("wp-theme-installing",t),e.updates.ajax("install-theme",t)},e.updates.installThemeSuccess=function(t){var s=$(".wp-full-overlay-header, [data-slug="+t.slug+"]"),n;a.trigger("wp-theme-install-success",t),n=s.find(".button-primary").removeClass("updating-message").addClass("updated-message disabled").attr("aria-label",e.updates.l10n.themeInstalledLabel.replace("%s",t.themeName)).text(e.updates.l10n.installed),e.a11y.speak(e.updates.l10n.installedMsg,"polite"),setTimeout(function(){t.activateUrl&&n.attr("href",t.activateUrl).removeClass("theme-install updated-message disabled").addClass("activate").attr("aria-label",e.updates.l10n.activateThemeLabel.replace("%s",t.themeName)).text(e.updates.l10n.activateTheme),t.customizeUrl&&n.siblings(".preview").replaceWith(function(){return $("<a>").attr("href",t.customizeUrl).addClass("button load-customize").text(e.updates.l10n.livePreview)})},1e3)},e.updates.installThemeError=function(t){var s,n,l=e.updates.l10n.installFailed.replace("%s",t.errorMessage),i=e.updates.adminNotice({className:"update-message notice-error notice-alt",message:l});e.updates.isValidResponse(t,"install")&&(e.updates.maybeHandleCredentialError(t,"install-theme")||(a.find("body").hasClass("full-overlay-active")?(n=$('.theme-install[data-slug="'+t.slug+'"]'),s=$(".install-theme-info").prepend(i)):(s=$('[data-slug="'+t.slug+'"]').removeClass("focus").addClass("theme-install-failed").append(i),n=s.find(".theme-install")),n.removeClass("updating-message").attr("aria-label",e.updates.l10n.themeInstallFailedLabel.replace("%s",n.data("name"))).text(e.updates.l10n.installFailedShort),e.a11y.speak(l,"assertive"),a.trigger("wp-theme-install-error",t)))},e.updates.deleteTheme=function(t){var s;return"themes"===pagenow?s=$(".theme-actions .delete-theme"):"themes-network"===pagenow&&(s=$('[data-slug="'+t.slug+'"]').find(".row-actions a.delete")),t=_.extend({success:e.updates.deleteThemeSuccess,error:e.updates.deleteThemeError},t),s&&s.html()!==e.updates.l10n.deleting&&s.data("originaltext",s.html()).text(e.updates.l10n.deleting),e.a11y.speak(e.updates.l10n.deleting,"polite"),$(".theme-info .update-message").remove(),a.trigger("wp-theme-deleting",t),e.updates.ajax("delete-theme",t)},e.updates.deleteThemeSuccess=function(s){var n=$('[data-slug="'+s.slug+'"]');"themes-network"===pagenow&&n.css({backgroundColor:"#faafaa"}).fadeOut(350,function(){var a=$(".subsubsub"),n=$(this),l=t.themes,i=e.template("item-deleted-row");n.hasClass("plugin-update-tr")||n.after(i({slug:s.slug,colspan:$("#bulk-action-form").find("thead th:not(.hidden), thead td").length,name:n.find(".theme-title strong").text()})),n.remove(),n.hasClass("update")&&(l.upgrade--,e.updates.decrementCount("theme")),n.hasClass("inactive")&&(l.disabled--,l.disabled?a.find(".disabled .count").text("("+l.disabled+")"):a.find(".disabled").remove()),a.find(".all .count").text("("+--l.all+")")}),e.a11y.speak(e.updates.l10n.deleted,"polite"),a.trigger("wp-theme-delete-success",s)},e.updates.deleteThemeError=function(t){var s=$('tr.inactive[data-slug="'+t.slug+'"]'),n=$(".theme-actions .delete-theme"),l=e.template("item-update-row"),i=s.siblings("#"+t.slug+"-update"),d=e.updates.l10n.deleteFailed.replace("%s",t.errorMessage),u=e.updates.adminNotice({className:"update-message notice-error notice-alt",message:d});e.updates.maybeHandleCredentialError(t,"delete-theme")||("themes-network"===pagenow?i.length?(i.find(".notice-error").remove(),i.find(".plugin-update").append(u)):s.addClass("update").after(l({slug:t.slug,colspan:$("#bulk-action-form").find("thead th:not(.hidden), thead td").length,content:u})):$(".theme-info .theme-description").before(u),n.html(n.data("originaltext")),e.a11y.speak(d,"assertive"),a.trigger("wp-theme-delete-error",t))},e.updates._addCallbacks=function(t,a){return"import"===pagenow&&"install-plugin"===a&&(t.success=e.updates.installImporterSuccess,t.error=e.updates.installImporterError),t},e.updates.queueChecker=function(){var t;if(!e.updates.ajaxLocked&&e.updates.queue.length)switch(t=e.updates.queue.shift(),t.action){case"install-plugin":e.updates.installPlugin(t.data);break;case"update-plugin":e.updates.updatePlugin(t.data);break;case"delete-plugin":e.updates.deletePlugin(t.data);break;case"install-theme":e.updates.installTheme(t.data);break;case"update-theme":e.updates.updateTheme(t.data);break;case"delete-theme":e.updates.deleteTheme(t.data);break;default:break}},e.updates.requestFilesystemCredentials=function(t){!1===e.updates.filesystemCredentials.available&&(t&&!e.updates.$elToReturnFocusToFromCredentialsModal&&(e.updates.$elToReturnFocusToFromCredentialsModal=$(t.target)),e.updates.ajaxLocked=!0,e.updates.requestForCredentialsModalOpen())},e.updates.maybeRequestFilesystemCredentials=function(t){e.updates.shouldRequestFilesystemCredentials&&!e.updates.ajaxLocked&&e.updates.requestFilesystemCredentials(t)},e.updates.keydown=function(t){27===t.keyCode?e.updates.requestForCredentialsModalCancel():9===t.keyCode&&("upgrade"!==t.target.id||t.shiftKey?"hostname"===t.target.id&&t.shiftKey&&($("#upgrade").focus(),t.preventDefault()):($("#hostname").focus(),t.preventDefault()))},e.updates.requestForCredentialsModalOpen=function(){var t=$("#request-filesystem-credentials-dialog");$("body").addClass("modal-open"),t.show(),t.find("input:enabled:first").focus(),t.on("keydown",e.updates.keydown)},e.updates.requestForCredentialsModalClose=function(){$("#request-filesystem-credentials-dialog").hide(),$("body").removeClass("modal-open"),e.updates.$elToReturnFocusToFromCredentialsModal&&e.updates.$elToReturnFocusToFromCredentialsModal.focus()},e.updates.requestForCredentialsModalCancel=function(){(e.updates.ajaxLocked||e.updates.queue.length)&&(_.each(e.updates.queue,function(e){a.trigger("credential-modal-cancel",e)}),e.updates.ajaxLocked=!1,e.updates.queue=[],e.updates.requestForCredentialsModalClose())},e.updates.showErrorInCredentialsForm=function(e){var t=$("#request-filesystem-credentials-form");t.find(".notice").remove(),t.find("#request-filesystem-credentials-title").after('<div class="notice notice-alt notice-error"><p>'+e+"</p></div>")},e.updates.credentialError=function(t,a){t=e.updates._addCallbacks(t,a),e.updates.queue.unshift({action:a,data:t}),e.updates.filesystemCredentials.available=!1,e.updates.showErrorInCredentialsForm(t.errorMessage),e.updates.requestFilesystemCredentials()},e.updates.maybeHandleCredentialError=function(t,a){return!(!e.updates.shouldRequestFilesystemCredentials||!t.errorCode||"unable_to_connect_to_filesystem"!==t.errorCode)&&(e.updates.credentialError(t,a),!0)},e.updates.isValidResponse=function(t,a){var s=e.updates.l10n.unknownError,n;if(_.isObject(t)&&!_.isFunction(t.always))return!0;switch(_.isString(t)&&"-1"===t?s=e.updates.l10n.nonceError:_.isString(t)?s=t:void 0!==t.readyState&&0===t.readyState?s=e.updates.l10n.connectionError:_.isString(t.responseText)&&""!==t.responseText?s=t.responseText:_.isString(t.statusText)&&(s=t.statusText),a){case"update":n=e.updates.l10n.updateFailed;break;case"install":n=e.updates.l10n.installFailed;break;case"delete":n=e.updates.l10n.deleteFailed;break}return s=s.replace(/<[\/a-z][^<>]*>/gi,""),n=n.replace("%s",s),e.updates.addAdminNotice({id:"unknown_error",className:"notice-error is-dismissible",message:_.escape(n)}),e.updates.ajaxLocked=!1,e.updates.queue=[],$(".button.updating-message").removeClass("updating-message").removeAttr("aria-label").prop("disabled",!0).text(e.updates.l10n.updateFailedShort),$(".updating-message:not(.button):not(.thickbox)").removeClass("updating-message notice-warning").addClass("notice-error").find("p").removeAttr("aria-label").text(n),e.a11y.speak(n,"assertive"),!1},e.updates.beforeunload=function(){if(e.updates.ajaxLocked)return e.updates.l10n.beforeunload},$(function(){var s=$("#plugin-filter"),n=$("#bulk-action-form"),l=$("#request-filesystem-credentials-form"),i=$("#request-filesystem-credentials-dialog"),d=$(".plugins-php .wp-filter-search"),u=$(".plugin-install-php .wp-filter-search");t=_.extend(t,window._wpUpdatesItemCounts||{}),t.totals&&e.updates.refreshCount(),e.updates.shouldRequestFilesystemCredentials=i.length>0,i.on("submit","form",function(t){t.preventDefault(),e.updates.filesystemCredentials.ftp.hostname=$("#hostname").val(),e.updates.filesystemCredentials.ftp.username=$("#username").val(),e.updates.filesystemCredentials.ftp.password=$("#password").val(),e.updates.filesystemCredentials.ftp.connectionType=$('input[name="connection_type"]:checked').val(),e.updates.filesystemCredentials.ssh.publicKey=$("#public_key").val(),e.updates.filesystemCredentials.ssh.privateKey=$("#private_key").val(),e.updates.filesystemCredentials.fsNonce=$("#_fs_nonce").val(),e.updates.filesystemCredentials.available=!0,e.updates.ajaxLocked=!1,e.updates.queueChecker(),e.updates.requestForCredentialsModalClose()}),i.on("click",'[data-js-action="close"], .notification-dialog-background',e.updates.requestForCredentialsModalCancel),l.on("change",'input[name="connection_type"]',function(){$("#ssh-keys").toggleClass("hidden","ssh"!==$(this).val())}).change(),a.on("credential-modal-cancel",function(t,a){var s=$(".updating-message"),n,l;"import"===pagenow?s.removeClass("updating-message"):"plugins"===pagenow||"plugins-network"===pagenow?"update-plugin"===a.action?n=$('tr[data-plugin="'+a.data.plugin+'"]').find(".update-message"):"delete-plugin"===a.action&&(n=$('[data-plugin="'+a.data.plugin+'"]').find(".row-actions a.delete")):"themes"===pagenow||"themes-network"===pagenow?"update-theme"===a.action?n=$('[data-slug="'+a.data.slug+'"]').find(".update-message"):"delete-theme"===a.action&&"themes-network"===pagenow?n=$('[data-slug="'+a.data.slug+'"]').find(".row-actions a.delete"):"delete-theme"===a.action&&"themes"===pagenow&&(n=$(".theme-actions .delete-theme")):n=s,n&&n.hasClass("updating-message")&&(l=n.data("originaltext"),void 0===l&&(l=$("<p>").html(n.find("p").data("originaltext"))),n.removeClass("updating-message").html(l),"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||("update-plugin"===a.action?n.attr("aria-label",e.updates.l10n.updateNowLabel.replace("%s",n.data("name"))):"install-plugin"===a.action&&n.attr("aria-label",e.updates.l10n.installNowLabel.replace("%s",n.data("name"))))),e.a11y.speak(e.updates.l10n.updateCancel,"polite")}),n.on("click","[data-plugin] .update-link",function(t){var a=$(t.target),s=a.parents("tr");t.preventDefault(),a.hasClass("updating-message")||a.hasClass("button-disabled")||(e.updates.maybeRequestFilesystemCredentials(t),e.updates.$elToReturnFocusToFromCredentialsModal=s.find(".check-column input"),e.updates.updatePlugin({plugin:s.data("plugin"),slug:s.data("slug")}))}),s.on("click",".update-now",function(t){var a=$(t.target);t.preventDefault(),a.hasClass("updating-message")||a.hasClass("button-disabled")||(e.updates.maybeRequestFilesystemCredentials(t),e.updates.updatePlugin({plugin:a.data("plugin"),slug:a.data("slug")}))}),s.on("click",".install-now",function(t){var s=$(t.target);t.preventDefault(),s.hasClass("updating-message")||s.hasClass("button-disabled")||(e.updates.shouldRequestFilesystemCredentials&&!e.updates.ajaxLocked&&(e.updates.requestFilesystemCredentials(t),a.on("credential-modal-cancel",function(){$(".install-now.updating-message").removeClass("updating-message").text(e.updates.l10n.installNow),e.a11y.speak(e.updates.l10n.updateCancel,"polite")})),e.updates.installPlugin({slug:s.data("slug")}))}),a.on("click",".importer-item .install-now",function(t){var s=$(t.target),n=$(this).data("name");t.preventDefault(),s.hasClass("updating-message")||(e.updates.shouldRequestFilesystemCredentials&&!e.updates.ajaxLocked&&(e.updates.requestFilesystemCredentials(t),a.on("credential-modal-cancel",function(){s.removeClass("updating-message").text(e.updates.l10n.installNow).attr("aria-label",e.updates.l10n.installNowLabel.replace("%s",n)),e.a11y.speak(e.updates.l10n.updateCancel,"polite")})),e.updates.installPlugin({slug:s.data("slug"),pagenow:pagenow,success:e.updates.installImporterSuccess,error:e.updates.installImporterError}))}),n.on("click","[data-plugin] a.delete",function(t){var a=$(t.target).parents("tr");t.preventDefault(),window.confirm(e.updates.l10n.aysDeleteUninstall.replace("%s",a.find(".plugin-title strong").text()))&&(e.updates.maybeRequestFilesystemCredentials(t),e.updates.deletePlugin({plugin:a.data("plugin"),slug:a.data("slug")}))}),a.on("click",".themes-php.network-admin .update-link",function(t){var a=$(t.target),s=a.parents("tr");t.preventDefault(),a.hasClass("updating-message")||a.hasClass("button-disabled")||(e.updates.maybeRequestFilesystemCredentials(t),e.updates.$elToReturnFocusToFromCredentialsModal=s.find(".check-column input"),e.updates.updateTheme({slug:s.data("slug")}))}),a.on("click",".themes-php.network-admin a.delete",function(t){var a=$(t.target).parents("tr");t.preventDefault(),window.confirm(e.updates.l10n.aysDelete.replace("%s",a.find(".theme-title strong").text()))&&(e.updates.maybeRequestFilesystemCredentials(t),e.updates.deleteTheme({slug:a.data("slug")}))}),n.on("click",'[type="submit"]',function(t){var s=$(t.target).siblings("select").val(),l=n.find('input[name="checked[]"]:checked'),i=0,d=0,u=[],r,p;switch(pagenow){case"plugins":case"plugins-network":r="plugin";break;case"themes-network":r="theme";break;default:return}if(!l.length)return t.preventDefault(),$("html, body").animate({scrollTop:0}),e.updates.addAdminNotice({id:"no-items-selected",className:"notice-error is-dismissible",message:e.updates.l10n.noItemsSelected});switch(s){case"update-selected":p=s.replace("selected",r);break;case"delete-selected":if(!window.confirm("plugin"===r?e.updates.l10n.aysBulkDelete:e.updates.l10n.aysBulkDeleteThemes))return void t.preventDefault();p=s.replace("selected",r);break;default:return}e.updates.maybeRequestFilesystemCredentials(t),t.preventDefault(),n.find('.manage-column [type="checkbox"]').prop("checked",!1),a.trigger("wp-"+r+"-bulk-"+s,l),l.each(function(t,a){var n=$(a),l=n.parents("tr");if("update-selected"===s&&(!l.hasClass("update")||l.find("notice-error").length))return void n.prop("checked",!1);e.updates.queue.push({action:p,data:{plugin:l.data("plugin"),slug:l.data("slug")}})}),a.on("wp-plugin-update-success wp-plugin-update-error wp-theme-update-success wp-theme-update-error",function(t,a){var s=$('[data-slug="'+a.slug+'"]'),n,l;"wp-"+a.update+"-update-success"===t.type?i++:(l=a.pluginName?a.pluginName:s.find(".column-primary strong").text(),d++,u.push(l+": "+a.errorMessage)),s.find('input[name="checked[]"]:checked').prop("checked",!1),e.updates.adminNotice=e.template("wp-bulk-updates-admin-notice"),e.updates.addAdminNotice({id:"bulk-action-notice",className:"bulk-action-notice",successes:i,errors:d,errorMessages:u,type:a.update}),n=$("#bulk-action-notice").on("click","button",function(){$(this).toggleClass("bulk-action-errors-collapsed").attr("aria-expanded",!$(this).hasClass("bulk-action-errors-collapsed")),n.find(".bulk-action-errors").toggleClass("hidden")}),d>0&&!e.updates.queue.length&&$("html, body").animate({scrollTop:0})}),a.on("wp-updates-notice-added",function(){e.updates.adminNotice=e.template("wp-updates-admin-notice")}),e.updates.queueChecker()}),u.length&&u.attr("aria-describedby","live-search-desc"),u.on("keyup input",_.debounce(function(t,a){var n=$(".plugin-install-search"),l,i;l={_ajax_nonce:e.updates.ajaxNonce,s:t.target.value,tab:"search",type:$("#typeselector").val(),pagenow:pagenow},i=location.href.split("?")[0]+"?"+$.param(_.omit(l,["_ajax_nonce","pagenow"])),"keyup"===t.type&&27===t.which&&(t.target.value=""),e.updates.searchTerm===l.s&&"typechange"!==a||(s.empty(),e.updates.searchTerm=l.s,window.history&&window.history.replaceState&&window.history.replaceState(null,"",i),n.length||(n=$('<li class="plugin-install-search" />').append($("<a />",{class:"current",href:i,text:e.updates.l10n.searchResultsLabel})),$(".wp-filter .filter-links .current").removeClass("current").parents(".filter-links").prepend(n),s.prev("p").remove(),$(".plugins-popular-tags-wrapper").remove()),void 0!==e.updates.searchRequest&&e.updates.searchRequest.abort(),$("body").addClass("loading-content"),e.updates.searchRequest=e.ajax.post("search-install-plugins",l).done(function(t){$("body").removeClass("loading-content"),s.append(t.items),delete e.updates.searchRequest,0===t.count?e.a11y.speak(e.updates.l10n.noPluginsFound):e.a11y.speak(e.updates.l10n.pluginsFound.replace("%d",t.count))}))},500)),d.length&&d.attr("aria-describedby","live-search-desc"),d.on("keyup input",_.debounce(function(t){var a={_ajax_nonce:e.updates.ajaxNonce,s:t.target.value,pagenow:pagenow,plugin_status:"all"},s;"keyup"===t.type&&27===t.which&&(t.target.value=""),e.updates.searchTerm!==a.s&&(e.updates.searchTerm=a.s,s=_.object(_.compact(_.map(location.search.slice(1).split("&"),function(e){if(e)return e.split("=")}))),a.plugin_status=s.plugin_status||"all",
window.history&&window.history.replaceState&&window.history.replaceState(null,"",location.href.split("?")[0]+"?s="+a.s+"&plugin_status="+a.plugin_status),void 0!==e.updates.searchRequest&&e.updates.searchRequest.abort(),n.empty(),$("body").addClass("loading-content"),$(".subsubsub .current").removeClass("current"),e.updates.searchRequest=e.ajax.post("search-plugins",a).done(function(t){var s=$("<span />").addClass("subtitle").html(e.updates.l10n.searchResults.replace("%s",_.escape(a.s))),l=$(".wrap .subtitle");a.s.length?l.length?l.replaceWith(s):$(".wrap h1").append(s):(l.remove(),$(".subsubsub ."+a.plugin_status+" a").addClass("current")),$("body").removeClass("loading-content"),n.append(t.items),delete e.updates.searchRequest,0===t.count?e.a11y.speak(e.updates.l10n.noPluginsFound):e.a11y.speak(e.updates.l10n.pluginsFound.replace("%d",t.count))}))},500)),a.on("submit",".search-plugins",function(e){e.preventDefault(),$("input.wp-filter-search").trigger("input")}),$("#typeselector").on("change",function(){var e=$('input[name="s"]');e.val().length&&e.trigger("input","typechange")}),$("#plugin_update_from_iframe").on("click",function(e){var t=window.parent===window?null:window.parent,a;$.support.postMessage=!!window.postMessage,!1!==$.support.postMessage&&null!==t&&-1===window.parent.location.pathname.indexOf("update-core.php")&&(e.preventDefault(),a={action:"update-plugin",data:{plugin:$(this).data("plugin"),slug:$(this).data("slug")}},t.postMessage(JSON.stringify(a),window.location.origin))}),$("#plugin_install_from_iframe").on("click",function(e){var t=window.parent===window?null:window.parent,a;$.support.postMessage=!!window.postMessage,!1!==$.support.postMessage&&null!==t&&-1===window.parent.location.pathname.indexOf("index.php")&&(e.preventDefault(),a={action:"install-plugin",data:{slug:$(this).data("slug")}},t.postMessage(JSON.stringify(a),window.location.origin))}),$(window).on("message",function(t){var a=t.originalEvent,s=document.location.protocol+"//"+document.location.hostname,n;if(a.origin===s){try{n=$.parseJSON(a.data)}catch(e){return}if(void 0!==n.action)switch(n.action){case"decrementUpdateCount":e.updates.decrementCount(n.upgradeType);break;case"install-plugin":case"update-plugin":window.tb_remove(),n.data=e.updates._addCallbacks(n.data,n.action),e.updates.queue.push(n),e.updates.queueChecker();break}}}),$(window).on("beforeunload",e.updates.beforeunload)})}(jQuery,window.wp,window._wpUpdatesSettings);