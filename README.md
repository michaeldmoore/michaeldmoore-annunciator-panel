# annunciator-panel
Custom annunciator panel for grafana, based on the built-in SingleStat panel

![michaeldmoore-annunciator-panel](https://user-images.githubusercontent.com/3724718/27811485-a2f3e7b8-601b-11e7-9c4c-ea0490d57a06.png)

Like Singlestat, the Annunciator Panel allows you to show the one main summary stat of a SINGLE series. It reduces the series into a single number (by looking at the max, min, average, or sum of values in the series). Annunciator also displays upper and lower alarm thresholds, colored to according to the value of the stat relative to the threshold, and optional flashing etc.

Features:
In addition to the basic features of SingleStat, this panel provides additional display attributes including the ability to set upper and lower warning and limit thresholds, and to set the colors appropriate to each of these states.

If desired, the displayed value can be set to flash when either of the limit values are exceeded.  The current values of these limits can also be displayed on the annunciator.

![michaeldmoore-annunciator-panel-options](https://user-images.githubusercontent.com/3724718/27811487-a615c132-601b-11e7-83a8-0412e57c605e.png)

This panel is designed to support simple timeseries data sets - unlike SingleStat, Annunciator does not support table-based data sets.
