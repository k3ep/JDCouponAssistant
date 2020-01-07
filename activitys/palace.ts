import Activity from "../interface/Activity";
import Utils from "../utils/utils";
import Config from "../config/config";

export default class Palace implements Activity {
    url: string = "https://api.m.jd.com/client.action";
    params: any;
    data: any;
    container: HTMLDivElement;
    outputTextarea: HTMLTextAreaElement;
    constructor(params: any, containerDiv: HTMLDivElement, outputTextarea: HTMLTextAreaElement) {
        this.params = params;
        this.container = containerDiv;
        this.outputTextarea = outputTextarea;
    }
    get(): void {
        fetch("https://api.m.jd.com/?functionId=pokerTaskList&body={}&client=megatron&clientVersion=1.0.0", { credentials: "include" })
            .then((res) => { return res.json() })
            .then((json) => {
                this.data = json.data;
                this.outputTextarea.value = `获取数据成功\n每日签到：${this.data[0]["status"]["userTimes"]}/${this.data[0]["status"]["finishCondition"]}\n关注店铺：${this.data[1]["status"]["userTimes"]}/${this.data[1]["status"]["finishCondition"]}\n浏览商品：${this.data[2]["status"]["userTimes"]}/${this.data[2]["status"]["finishCondition"]}\n邀请好友：${this.data[3]["status"]["userTimes"]}/${this.data[3]["status"]["finishCondition"]}`;
                this.list();
            })
    }

    list(): void {
        const content = document.createElement("div");

        let msg = `
        <div style="margin:10px;">
        <button style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block"><a href="https://t.jd.com/follow/vender/list.do" target="_blank">取消关注店铺</a></button>
        <button class="visit" style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">一键关注店铺</button>
        <button class="browse" style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">一键浏览会场</button>
        <button class="sign" style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">一键每日签到</button>
        <button class="auto" style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">一键自动完成</button></div>`;

        content.innerHTML = msg;
        this.container.appendChild(content);
        const e = document.querySelector('.sign'),
            v = document.querySelector('.visit'),
            g = document.querySelector('.browse'),
            a = document.querySelector('.auto');

        e!.addEventListener('click', () => {
            Utils.outPutLog(this.outputTextarea, `开始自动签到`)
            this.sign();
        });
        v!.addEventListener('click', () => {
            Utils.outPutLog(this.outputTextarea, `开始自动关注店铺`)
            this.visit();
        });
        g!.addEventListener('click', () => {
            Utils.outPutLog(this.outputTextarea, `开始自动浏览会场`)
            this.browse();
        });
        a!.addEventListener('click', () => {
            Utils.outPutLog(this.outputTextarea, `开始自动全部任务`)
            this.sign();
            this.visit();
            this.browse();
        });
    }

    send(taskId: number, index: number) {

    }

    sign() {
        fetch('https://api.m.jd.com/?functionId=doPokerTask&body={%22taskType%22:%22SIGN%22,%22taskId%22:%221%22}&client=megatron&clientVersion=1.0.0', { credentials: "include" })
            .then((res) => { return res.json() })
            .then((json) => {
                Utils.outPutLog(this.outputTextarea, `签到成功！`);
            });
    }

    visit() {
        let self = this;
        fetch('https://api.m.jd.com/?functionId=taskDetail&body={%22taskType%22:%22FOLLOW_SHOP%22}&client=megatron&clientVersion=1.0.0', { credentials: "include" })
            .then(function (response) {
                return response.json()
            }).then((res) => {
                const shopData = res.data.items;
                for (let i = 0; i < 3; i++) {
                    let item = shopData[i],
                        url = `https://api.m.jd.com/?functionId=doPokerTask&body={%22taskType%22:%22FOLLOW_SHOP%22,%22taskId%22:%22${item.itemId}%22}&client=megatron&clientVersion=1.0.0`;
                    (function (index, data, len) {
                        setTimeout(() => {
                            fetch(data, { credentials: "include" })
                                .then(function (response) {
                                    return response.json()
                                }).then((res) => {
                                    if (res.success) {
                                        Utils.outPutLog(self.outputTextarea, `${new Date().toLocaleString()} 操作成功！任务序号：${index + 1}/${len}`);
                                    } else {
                                        Utils.outPutLog(self.outputTextarea, `这个店铺已经被收藏过啦！建议先批量取消关注店铺后再执行这个任务！`);
                                    }
                                    if (index + 1 >= len) {
                                        Utils.outPutLog(self.outputTextarea, `${new Date().toLocaleString()} 当前任务已完成!`);
                                    }
                                });
                        }, (Config.timeoutSpan + Utils.random(300, 500)) * index);
                    })(i, url, 3)
                }
            })
    }

    browse() {
        let self = this;
        fetch('https://api.m.jd.com/?functionId=taskDetail&body={%22taskType%22:%22BROWSE_ACTIVITY%22}&client=megatron&clientVersion=1.0.0', { credentials: "include" })
            .then(function (response) {
                return response.json()
            }).then((res) => {
                const shopData = res.data.items;
                for (let i = 0; i < 4; i++) {
                    let item = shopData[i],
                        url = `https://api.m.jd.com/?functionId=doPokerTask&body={%22taskType%22:%22BROWSE_ACTIVITY%22,%22taskId%22:%22${item.itemId}%22}&client=megatron&clientVersion=1.0.0`;
                    (function (index, data, len) {
                        setTimeout(() => {
                            fetch(data, { credentials: "include" })
                                .then(function (response) {
                                    return response.json()
                                }).then((res) => {
                                    Utils.outPutLog(self.outputTextarea, `${new Date().toLocaleString()} 操作成功！任务序号：${index + 1}/${len}`);
                                    if (index + 1 >= len) {
                                        Utils.outPutLog(self.outputTextarea, `${new Date().toLocaleString()} 当前任务已完成!`);
                                    }
                                });
                        }, (Config.timeoutSpan + Utils.random(300, 500)) * index);
                    })(i, url, 4)
                }
            })
    }
}