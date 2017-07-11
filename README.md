# annunciator-panel
Custom annunciator panel for grafana, based on the built-in SingleStat panel

![Showcase](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-annunciator-panel/src/img/Showcase.gif)

Like Singlestat, the Annunciator Panel allows you to show the one main summary stat of a SINGLE series. It reduces the series into a single number (by looking at the max, min, average, or sum of values in the series). Annunciator also displays upper and lower alarm thresholds, colored to according to the value of the stat relative to the threshold, and optional flashing etc.

Features:
In addition to the basic features of SingleStat, this panel provides additional display attributes including the ability to set upper and lower warning and limit thresholds, and to set the colors appropriate to each of these states.

If desired, the displayed value can be set to flash when either of the limit values are exceeded.  The current values of these limits can also be displayed on the annunciator.

![Options](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-annunciator-panel/src/img/Options.png)

This panel is designed to support simple timeseries data sets - unlike SingleStat, Annunciator does not support table-based data sets.
