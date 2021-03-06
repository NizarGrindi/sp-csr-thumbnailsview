(function () {
    ExecuteOrDelayUntilScriptLoaded(_registerSliderViewTemplate, 'clienttemplates.js');
})();

function _registerSliderViewTemplate() {
    // Initialize the variable that store the objects. 
    var overrideCtx = {};
    overrideCtx.Templates = {};
    overrideCtx.Templates.Header = HeaderOverrideFun;
    overrideCtx.Templates.Item = ItemRenderCustom;

    overrideCtx.BaseViewID = 1;
    overrideCtx.ListTemplateType = 101;

    // Register the template overrides. 
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
}

function HeaderOverrideFun(ctx) {
    var finalHeaderHtml = '';
    finalHeaderHtml += '<style type="text/css">';
    finalHeaderHtml += '    .ms-listviewtable thead tr { table-layout:fixed; display:table-row-group; float:left; } ';
    finalHeaderHtml += '    .tbTitle { margin-bottom: 5px; margin-top: 10px; } ';
    finalHeaderHtml += '    .tbTrItem { table-layout:fixed; display:table-row-group; float:left; height: 300px !important; } ';
    finalHeaderHtml += '    .tbTitle { text-overflow: ellipsis; overflow: hidden; white-space: nowrap; overflow: hidden; width: 300px; } ';
    finalHeaderHtml += '    .tbTdItem { width: 300px; } ';
    finalHeaderHtml += '</style>';
    finalHeaderHtml += RenderHeaderTemplate(ctx);

    return finalHeaderHtml;
}

function ItemRenderCustom(renderCtx) {
    var listItem = renderCtx.CurrentItem;
    var listSchema = renderCtx.ListSchema;
    var idx = renderCtx.CurrentItemIdx;
    var cssClass = idx % 2 == 1 ? "ms-alternating " : "";

    if (FHasRowHoverBehavior(renderCtx)) {
        cssClass += " ms-itmHoverEnabled ";
    }
    var ret = [];

    ret.push('<tr class="tbTrItem ');
    ret.push('" iid="');
    var iid = GenerateIID(renderCtx);
    //var idString = ctx.ctxId + ',' + listItem.ID + ',' + listItem.FSObjType;

    ret.push(iid);
    ret.push('" id="');
    ret.push(iid);
    ret.push('">');

    var fields = listSchema ? listSchema.Field : null;
    var owaUrl = listItem.ServerRedirectedEmbedUrl;
    var newOwaUrl = "";
    var newOwaFullPageUrl = "";
    if (owaUrl != null) {
        newOwaUrl = owaUrl.replace('WopiFrame', 'WopiFrame2');
        newOwaFullPageUrl = newOwaUrl.replace('interactivepreview', 'view');
    }

    var titleText = listItem.Title;
    if (titleText == null) {
        titleText = listItem.FileLeafRef;
    }

    var target = "_blank";
    if (listItem.ContentTypeId.lastIndexOf("0x0120", 0) === 0) {
        titleText = listItem.FileLeafRef; //name
        newOwaFullPageUrl = listItem.FileRef; //url
        newOwaUrl = "/_layouts/images/folder.gif"
        target = "_self";
    }

    //#region Enable item selection
    ret.push('<td class="ms-cellStyleNonEditable ms-vb-itmcbx ms-vb-imgFirstCell" tabindex="0">');
    ret.push('<div role="checkbox" class="s4-itm-cbx s4-itm-imgCbx" tabindex="-1" title="' + titleText + '" >');
    ret.push('<span class="s4-itm-imgCbx-inner">');
    ret.push('<span class="ms-selectitem-span">');
    ret.push('<img class="ms-selectitem-icon" alt="" src="/_layouts/15/images/spcommon.png?rev=44">');
    ret.push('</span>');
    ret.push('</span>');
    ret.push('</div>');
    ret.push('</td>');
    //#endregion

    ret.push('<td colspan="');
    ret.push(fields.length + 2);
    ret.push('" class="tbTdItem" >');
    ret.push('<div class="tbTitle"><a href="');
    ret.push(newOwaFullPageUrl);
    ret.push('" target="' + target + '" title="' + titleText + '" >');
    ret.push(titleText);
    ret.push('</a></div>');
    ret.push('<iframe src="');
    ret.push(newOwaUrl);
    ret.push('" width="300" height="250"></iframe>');
    ret.push('</td>');
    ret.push('</tr>');
    return ret.join('');
};