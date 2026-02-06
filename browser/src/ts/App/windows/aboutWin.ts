import { AppInfo } from "../../appInfo";
import { htmlEscape } from "../../Core/util";

export class AboutWin {
    private $win: JQuery;

    constructor() {
        const inWeb = !!!(<any>window).ipcRenderer;
        const title = inWeb ? AppInfo.AppTitle : AppInfo.AppTitle.replace("Web ","");
        let win = document.createElement("div");
        win.style.display = "none";
        win.className = "winAbout";
        document.body.appendChild(win);

        win.innerHTML = `
        <!--header-->
        <div>INFORMAZIONI CLIENT E VERSIONE</div>
        <!--content-->
        <div style="text-align:center;">
            <h1><a href="https://temporasanguinis.github.io/TS2-Client/" target="_blank">${title}</a></h1>
            <a href="https://temporasanguinis.github.io/TS2-Client/" target="_blank">Sito Web, downloads, e donazioni</a>
            <br>
            <br>
            Versione: ${AppInfo.Version}
            <br>
            Build: ${AppInfo.Build}
            <br>
            <br>
            Github repo: <a href="${AppInfo.RepoUrl}" target="_blank">${AppInfo.RepoUrl}</a>
            <br>
            Bug report: <a href="${AppInfo.BugsUrl}" target="_blank">${AppInfo.BugsUrl}</a>
            <br>
            <br>
            Autore: ${htmlEscape(AppInfo.Author)}
            <br>
            Contributori: ${htmlEscape(AppInfo.Contributors.join(", "))}<br><br>
        </div>
        `;

        this.$win = $(win);

        const w = Math.min($(window).width()-20, 480);
        const h = Math.min($(window).height()-20, 290);

        (<any>this.$win).jqxWindow({width: w, height: h});
    }

    public show() {
        (<any>this.$win).jqxWindow("open");
        (<any>this.$win).jqxWindow("bringToFront");
    }
}
