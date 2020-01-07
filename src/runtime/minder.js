/**
 * @fileOverview
 *
 * 脑图示例运行时
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
    var Minder = require('../minder');

    function MinderRuntime() {

        // 不使用 kityminder 的按键处理，由 ReceiverRuntime 统一处理
        var minder = new Minder({
            enableKeyReceiver: false,
            enableAnimation: true,
        });

        // 渲染，初始化
        minder.renderTo(this.selector);
        minder.setTheme(null);
        minder.select(minder.getRoot(), true);
        minder.execCommand('text', '中心主题');
        // 导出给其它 Runtime 使用
        this.minder = minder;

        //只读和可编辑
        minder.readOnly = function () {
            if (!this.isReadonly) {
                this.fire('readonly');
                this.isReadonly = true;
                $('#more-op').click();
            }
        };
        minder.editable = function () {
            if (this.isReadonly) {
                if (minder.isRemote) {
                    toastr.info("远程数据请下载到本地然后加载方可编辑！");
                    return;
                }
                editor.container.appendChild(editor.receiver.element)
                editor.hotbox.$container.appendChild(editor.hotbox.$element);
                this.enable();
                this.setStatus("normal", true);
                this.isReadonly = false;
            }
        };
    }

    return module.exports = MinderRuntime;
});