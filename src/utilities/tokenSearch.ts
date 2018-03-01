import { IActionMap } from "../Interfaces/IActionMap";
import * as Global from "../global";

const tokenMap: IActionMap = Global.tokenMap;
export function searchForTokens(text: string,
    map: IActionMap = tokenMap,
    match: boolean = false): string | null {
    var split = text.split(" ");
    //console.log("begin");
    if (split.length == 0) split = [text];
    for (var i = 0; i < split.length; i++) {
        var token = split[i].toLowerCase();
        //console.log("iterate", token);
        if (map[token] != null) {
            if (typeof map[token] == "string") {
                //console.log("returning", map[token]);
                return <string>map[token];
            } else if (typeof map[token] == "object") {
                //console.log("returning recursive", text.replace(token, ""), <IActionMap>map[token]);
                return searchForTokens(text.replace(token, ""), <IActionMap>map[token], true)
            }
        } else if (match && map[''] != null) {
            //console.log("returning ", map['']);
            return <string>map[''];
        };
    };
    //console.log("returning ", 'null');
    return null;
}
