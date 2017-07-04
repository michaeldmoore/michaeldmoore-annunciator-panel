import {
    MetricsPanelCtrl
} from 'app/plugins/sdk';

import "./css/annunciator-panel.css!";

import _ from 'lodash';
//import moment from 'moment';
import angular from 'angular';
import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';

class AnnunciatorPanelCtrl extends MetricsPanelCtrl {

    /** @ngInject */
    constructor($scope, $injector) {
        super($scope, $injector);

        var panelDefaults = {
            "LowerLimit": {
                "DisplayOption": "disabled",
                "Color": "rgb(2, 17, 249)",
                "Value": "20",
                "FontSize": "100%"
            },
            "LowerWarning": {
                "DisplayOption": "disabled",
                "Color": "rgb(9, 115, 102)",
                "Value": "25"
            },
            "OK": {
                "Color": "rgb(2, 247, 2)"
            },
            "UpperLimit": {
                "DisplayOption": "disabled",
                "Color": "rgb(247, 2, 2)",
                "Value": "80"
            },
            "UpperWarning": {
                "DisplayOption": "disabled",
                "Color": "rgb(247, 90, 7)",
                "Value": "75",
                "FontSize": "100%"
            },
            "decimals": 2,
            "format": "percent",
            "postfix": "POST",
            "postfixFontSize": "100%",
            "prefix": "PRE",
            "prefixFontSize": "100%",
            "sparkline": {
                "fillColor": "rgba(19, 193, 91, 0.32)",
                "full": false,
                "lineColor": "rgb(145, 200, 16)",
                "show": true
            },
            "valueFontSize": "100%",
            "valueName": "current"
        };

        var panel = {};
        //		var $panelContainer = elem.find('.panel-container');
        var elem = {}; //this.panel.find('.singlestat-panel');
        var ctrl = {};


        _.defaults(this.panel, this.panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    }

    onDataError(err) {
        console.log("Annunciator::onDataError", err);
        this.seriesList = [];
        this.render([]);
    }

    onInitEditMode() {
        this.valueNameOptions = ['min', 'max', 'avg', 'current', 'total', 'name', 'first', 'delta', 'diff', 'range'];
        this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
        this.fontSizes0 = [''].concat(this.fontSizes);
        this.valueDisplayOptions = ['disabled', 'static', 'flash'];
        this.unitFormats = kbn.getUnitFormats();
        this.addEditorTab('Options', 'public/plugins/michaeldmoore-annunciator-panel/options.html', 2);
    }

    setUnitFormat(subItem) {
        this.panel.format = subItem.value;
        this.render();
    }

    getValueRegion(value) {
        var valueRegion = "OK";

        if (this.panel.UpperLimit.DisplayOption != 'disabled') {
            if (value >= this.panel.UpperLimit.Value)
                valueRegion = "UpperLimit";
            else if (this.panel.UpperWarning.DisplayOption != 'disabled' && (value >= this.panel.UpperWarning.Value))
                valueRegion = "UpperWarning";
        }

        if (this.panel.LowerLimit.DisplayOption != 'disabled') {
            if (value <= this.panel.LowerLimit.Value)
                valueRegion = "LowerLimit";
            else if (this.panel.LowerWarning.DisplayOption != 'disabled' && (value <= this.panel.LowerWarning.Value))
                valueRegion = "LowerWarning";
        }

        //console.log ("this.getValueRegion(" + value + ")=" + valueRegion);

        return valueRegion;
    }

    getDisplayAttributesForValue(value, metric) {
        var displayAttributes = {};
        var color = this.panel.OK.Color;
        var flash = false;

        var valueRegion = this.getValueRegion(this.data.value);
        switch (valueRegion) {
            case "UpperLimit":
                color = this.panel.UpperLimit.Color;
                break;

            case "UpperWarning":
                color = this.panel.UpperWarning.Color;
                break;

            case "LowerWarning":
                color = this.panel.LowerWarning.Color;
                break;

            case "LowerLimit":
                color = this.panel.LowerLimit.Color;
                break;
        }

        switch (metric) {
            case "UpperLimit":
                color = this.panel.UpperLimit.Color;
                break;

                //case "UpperWarning": 
                //color = this.panel.UpperWarning.Color; 
                //break;

                //case "LowerWarning":
                //color = this.panel.LowerWarning.Color; 
                //break;

            case "LowerLimit":
                color = this.panel.LowerLimit.Color;
                break;
        }

        flash = ((valueRegion == "UpperLimit" && this.panel.UpperLimit.DisplayOption == "flash" && (metric == "Value" || metric == "UpperLimit")) ||
            (valueRegion == "LowerLimit" && this.panel.LowerLimit.DisplayOption == "flash" && (metric == "Value" || metric == "LowerLimit")));

        displayAttributes.color = color;
        displayAttributes.flash = flash;

        //console.log ("this.getDisplayAttributesForValue(" + value + ", '" + metric + "'), color=" + color + ", flash=" + flash);
        return displayAttributes;
    }

    buildValueHtml() {
        var html1 = '';

        html1 += "<div class='michaeldmoore-annunciator-panel-value-container'>";
        if (this.panel.prefix)
            html1 += this.getTextSpan('michaeldmoore-annunciator-panel-prefix', this.panel.prefixFontSize, '', this.panel.prefix, false);

        html1 += this.getValueSpan('michaeldmoore-annunciator-panel-value', this.panel.valueFontSize, this.data.value, "Value");

        if (this.panel.postfix)
            html1 += this.getTextSpan('michaeldmoore-annunciator-panel-postfix', this.panel.postfixFontSize, '', this.panel.postfix, false);

        html1 += "</div>";

        return html1;
    }

    buildLimitsHtml() {
        var html0 = '';

        if (this.panel.UpperLimit.DisplayOption != 'disabled' || this.panel.LowerLimit.DisplayOption != 'disabled') {
            html0 += "<div class='michaeldmoore-annunciator-panel-limits-container'>";

            if (this.panel.LowerLimit.DisplayOption != 'disabled')
                html0 += this.getValueSpan('michaeldmoore-annunciator-panel-lower-limit', this.panel.LowerLimit.FontSize, this.panel.LowerLimit.Value, "LowerLimit");

            if (this.panel.UpperLimit.DisplayOption != 'disabled')
                html0 += this.getValueSpan('michaeldmoore-annunciator-panel-upper-limit', this.panel.UpperLimit.FontSize, this.panel.UpperLimit.Value, "UpperLimit");

            html0 += "</div>";

            html0 += "<div style='float:none;'/>";
        }
        return html0;
    }

    buildHtml() {
        var html = "<div class='michaeldmoore-annunciator-panel-container' style='height:" + this.ctrl.height + "px;'>";

        if (this.data != null && this.data.value != null) {
            html += this.buildLimitsHtml();
            html += this.buildValueHtml();
        } else
            console.log("last data point is null...");

        html += "</div>";

        this.elem.html(html);

        if (this.panel.sparkline.show) {
            this.addSparkline();
        }
    }

    getTextSpan(className, fontSize, color, text, flash) {
        var style = '';

        if (fontSize)
            style += "font-size:" + fontSize + ";";

        if (color)
            style += "color:" + color + ";";

        if (style)
            style = ' style="' + style + '"';

        if (flash)
            className += " michaeldmoore-annunciator-flash";

        return '<span class="' + className + '"' + style + '>' + text + '</span>';
    }

    getValueSpan(className, fontSize, value, metric) {
        var displayAttributes = this.getDisplayAttributesForValue(value, metric);
        return this.getTextSpan(className, fontSize, displayAttributes.color, this.formatValue(value), displayAttributes.flash);
    }


    onRender() {
        this.buildHtml();
        this.ctrl.renderingCompleted();
    }


    onDataReceived(dataList) {
        //console.log("Annunciator::onDataReceived()");
        var data = {};
        var dataPoints = dataList[0].datapoints;
        if (dataPoints.length < 2) {
            console.log("No data", dataPoints);
        } else {
            this.series = dataList.map(this.seriesHandler.bind(this));
            this.setValues(data);
            //this.value = dataPoints[0][0];
        }
        this.data = data;
        this.render();
    }

    seriesHandler(seriesData) {
        var series = new TimeSeries({
            datapoints: seriesData.datapoints,
            alias: seriesData.target,
        });

        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
        return series;
    }

    getDecimalsForValue(value) {
        if (_.isNumber(this.panel.decimals)) {
            return {
                decimals: this.panel.decimals,
                scaledDecimals: null
            };
        }

        var delta = value / 2;
        var dec = -Math.floor(Math.log(delta) / Math.LN10);

        var magn = Math.pow(10, -dec),
            norm = delta / magn, // norm is between 1.0 and 10.0
            size;

        if (norm < 1.5) {
            size = 1;
        } else if (norm < 3) {
            size = 2;
            // special case for 2.5, requires an extra decimal
            if (norm > 2.25) {
                size = 2.5;
                ++dec;
            }
        } else if (norm < 7.5) {
            size = 5;
        } else {
            size = 10;
        }

        size *= magn;

        // reduce starting decimals if not needed
        if (Math.floor(value) === value) {
            dec = 0;
        }

        var result = {};
        result.decimals = Math.max(0, dec);
        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

        return result;
    }

    formatValue(value) {
        var decimalInfo = this.getDecimalsForValue(value);
        var formatFunc = kbn.valueFormats[this.panel.format];
        return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
    }

    setValues(data) {
        //console.log("Annunciator::setValues()");
        data.flotpairs = [];

        if (this.series.length > 1) {
            var error = new Error();
            error.message = 'Multiple Series Error';
            error.data = 'Metric query returns ' + this.series.length +
                ' series. Single Stat Panel expects a single series.\n\nResponse:\n' + JSON.stringify(this.series);
            throw error;
        }

        if (this.series && this.series.length > 0) {
            var lastPoint = _.last(this.series[0].datapoints);
            var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;

            if (this.panel.valueName === 'name') {
                data.value = 0;
                data.valueRounded = 0;
                data.valueFormatted = this.series[0].alias;
            } else if (_.isString(lastValue)) {
                data.value = 0;
                data.valueFormatted = _.escape(lastValue);
                data.valueRounded = 0;
            } else {
                data.value = this.series[0].stats[this.panel.valueName];
                data.flotpairs = this.series[0].flotpairs;

                if (data == null || data.value == null) {
                    data.value = 0.0;
                }

                var decimalInfo = this.getDecimalsForValue(data.value);
                var formatFunc = kbn.valueFormats[this.panel.format];
                data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
            }

            if (data == null || data.value == null) {
                data.value = 0.0;
            }

            // Add $__name variable for using in prefix or postfix
            data.scopedVars = _.extend({}, this.panel.scopedVars);
            data.scopedVars["__name"] = {
                value: this.series[0].label
            };
        }
    }

    addSparkline() {
        if (this.elem == null || this.elem.width() < 10) {
            // element has not gotten it's width yet
            // delay sparkline render
            setTimeout(this.addSparkline, 30);
            return;
        }

        var width = this.elem.width() + 20;
        var height = this.ctrl.height;
        var plotCanvas = $('<div></div>');
        var plotCss = {};
        plotCss.position = 'absolute';

        if (this.panel.sparkline.full) {
            plotCss.bottom = '5px';
            plotCss.left = '-5px';
            plotCss.width = (width - 10) + 'px';
            var dynamicHeightMargin = height <= 100 ? 5 : (Math.round((height / 100)) * 15) + 5;
            plotCss.height = (height - dynamicHeightMargin) + 'px';
        } else {
            plotCss.bottom = "0px";
            plotCss.left = "-5px";
            plotCss.width = (width - 10) + 'px';
            plotCss.height = Math.floor(height * 0.25) + 'px';
        }

        plotCanvas.css(plotCss);

        var options = {
            legend: {
                show: false
            },
            series: {
                lines: {
                    show: true,
                    fill: 1,
                    lineWidth: 1,
                    fillColor: this.panel.sparkline.fillColor,
                },
            },
            yaxes: {
                show: false
            },
            xaxis: {
                show: false,
                mode: "time",
                min: this.ctrl.range.from.valueOf(),
                max: this.ctrl.range.to.valueOf(),
            },
            grid: {
                hoverable: false,
                show: false
            },
        };

        this.elem.find('.michaeldmoore-annunciator-panel-container').append(plotCanvas);

        var plotSeries = {
            data: this.data.flotpairs,
            color: this.panel.sparkline.lineColor
        };

        //console.log("annunciator::addSparkline() - " + this.data.flotpairs.length + " flotpairs");

        $.plot(plotCanvas, [plotSeries], options);
    }

    onConfigChanged() {
        this.refresh();
    }

    link(scope, elem, attrs, ctrl) {
        this.ctrl = ctrl;
        //this.$panelContainer = elem.find('.panel-container');
        //this.$panelsWrapper = elem.find('.panels-wrapper');
        this.elem = elem.find('.panel-content');
        //console.log("Annunciator::link()");
    }
}

AnnunciatorPanelCtrl.templateUrl = 'module.html';

export {
    AnnunciatorPanelCtrl as PanelCtrl
};