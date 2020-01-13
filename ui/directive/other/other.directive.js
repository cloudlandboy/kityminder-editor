angular.module('kityminderEditor')
    .directive('other', ['lang.zh-cn', function (zhText) {
        return {
            restrict: 'C',
            templateUrl: 'ui/directive/other/other.html',
            scope: {
                minder: '='
            },
            link: function (scope) {
                minder.otherScope = scope;
                scope.downLink = $('<a class="hidden" id="downLink"></a>')[0];
                scope.isFullScreen = false;
                scope.fontSizeList = [10, 12, 16, 18, 24, 32, 48];
                $(document.body).append(scope.downLink);
                function fullScreen(element) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullScreen();
                    }
                    scope.isFullScreen = true;
                    $('#fullScreen-btn').text(zhText['zh-cn'].ui.other.exitView);
                };
                function exitFullscreen() {
                    if (document.exitFullScreen) {
                        document.exitFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (element.msExitFullscreen) {
                        element.msExitFullscreen();
                    }
                    scope.isFullScreen = false;
                    $('#fullScreen-btn').text(zhText['zh-cn'].ui.other.view);
                };

                scope.closeAll = function () {
                    kity.closeDeep = true;
                    minder.execCommand('ExpandToLevel', 1);
                    kity.closeDeep = false;
                }
                scope.viewModel = function () {
                    if (this.isFullScreen) {
                        exitFullscreen();
                    } else {
                        fullScreen(document.documentElement);
                        minder.readOnly();
                        this.closeTop();
                        minder.getStatus() != 'hand' && minder.execCommand('hand');
                    }
                };
                scope.download = function (fm, ext) {
                    editor.minder.exportData(fm).then(function (data) {
                        var fileName = minder.getRoot().data.text;
                        var blob;
                        if (fm == 'png') {
                            blob = base64ToBlob(data);
                        } else if (ext == 'html') {
                            var a = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">';
                            var b = '<title>' + fileName + '</title></head><body>' + data + '</body></html>';
                            blob = new Blob([a + b]);
                        } else {
                            blob = new Blob([data]);
                        }
                        fileName = fileName.replace(fileName[0], fileName[0].toLowerCase()) + '.' + ext;
                        downloadFile(fileName, blob)
                    });
                };
                scope.loadData = function (type) {
                    if (type == 'local') {
                        scope.localFile.click();
                    } else if (type == 'remote') {
                        toastr.info('暂时不支持');
                    }
                }
                scope.localFile = $('#localFile')[0];
                scope.allowExt = ['txt', 'md', 'json'];
                scope.localFile.onchange = function () {
                    var file = this.files[0];
                    var fileExt = file.name.split('.').pop();
                    if (!(scope.allowExt.includes(fileExt))) {
                        toastr.error("不支持的文件类型！仅支持.txt|.md|.json文件");
                        return;
                    }
                    var fileReader = new FileReader();
                    fileReader.readAsText(file);
                    fileReader.onload = function () {
                        try {
                            if (fileExt == 'json') {
                                scope.minder.importJson(JSON.parse(fileReader.result))
                            } else {
                                fileExt = fileExt == 'txt' ? 'text' : 'markdown';
                                editor.minder.importData(fileExt, fileReader.result)
                            }
                            minder.isRemote = false;
                            minder.editable();
                        } catch (e) {
                            console.error(e);
                            toastr.error("出错了，不兼容的" + fileExt + "格式！");
                        }
                    }
                };
                scope.closeTop = function () {
                    var container = window.editor.container;
                    var topTab = $('#top-tab');
                    editor.lastTop = topTab.height();
                    topTab.slideUp();
                    $(container).animate({
                        top: '0px'
                    });
                    $('#showMenuBtn').removeClass('hidden');
                };
                scope.createNew = function () {
                    var data = new kityminder.Node().getData();
                    data.text = "NEW";
                    var mind = {
                        "template": scope.minder.getTemplate(),
                        "theme": scope.minder.getTheme(),
                        "version": kityminder.version,
                        "root": {
                            "children": [],
                            "data": data
                        }
                    };
                    scope.minder.importJson(mind);
                    minder.isRemote = false;
                    minder.editable();
                };
                scope.createNewConfirm = function () {
                    $('#createNewModal').modal('show');
                };
                scope.changeFontSize = function (size) {
                    if (minder.isRemote) {
                        minder.enable();
                        var tempScope = $('.select').scope();
                        tempScope.select['all']();
                        minder.execCommand('fontsize', size);
                        tempScope.select['revert']();
                        minder.disable();
                        minder.execCommand('hand');
                        scope.currentFontSize = size + "px";
                    }
                };

                function downloadFile(fileName, blob) {
                    scope.downLink.download = fileName;
                    scope.downLink.href = URL.createObjectURL(blob);
                    scope.downLink.click()
                }
                //base64转blob
                window.base64ToBlob = function (code) {
                    var parts = code.split(';base64,');
                    var contentType = parts[0].split(':')[1];
                    var raw = window.atob(parts[1]);
                    var rawLength = raw.length;

                    var uInt8Array = new Uint8Array(rawLength);

                    for (var i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i);
                    }
                    return new Blob([uInt8Array], { type: contentType });
                }

                window.getBase64Image = function (img) {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                    var dataUrl = canvas.toDataURL("images/" + ext);
                    return dataUrl;
                };
            }
        }
    }]);