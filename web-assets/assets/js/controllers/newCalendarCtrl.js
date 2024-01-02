scsFamilyApp.controller('CalendarController', [
    '$scope',
    '$attrs',
    '$parse',
    '$interpolate',
    '$log',
    'dateFilter',
    'calendarConfig',
    'scsFamilyData',
    function ($scope, $attrs, $parse, $interpolate, $log, dateFilter, calendarConfig) {
        'use strict';
        var self = this,
            ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

        // Configuration attributes
        angular.forEach(['formatDay', 'formatDayHeader', 'formatDayTitle', 'formatWeekTitle', 'formatMonthTitle', 'formatWeekViewDayHeader', 'formatHourColumn', 'allDayLabel', 'noEventsLabel'], function (key, index) {
            self[key] = angular.isDefined($attrs[key]) ? $interpolate($attrs[key])($scope.$parent) : calendarConfig[key];
        });

        angular.forEach(['showWeeks', 'showEventDetail', 'startingDay', 'eventSource', 'queryMode', 'step'], function (key, index) {
            self[key] = angular.isDefined($attrs[key]) ? $scope.$parent.$eval($attrs[key]) : calendarConfig[key];
        });

        self.hourParts = 1;
        if (self.step === 60 || self.step === 30 || self.step === 15) {
            self.hourParts = Math.floor(60 / self.step);
        } else {
            throw new Error('Invalid step parameter: ' + self.step);
        }

        var unregisterFn = $scope.$parent.$watch($attrs.eventSource, function (value) {
            self.onEventSourceChanged(value);
        });

        $scope.$on('$destroy', unregisterFn);

        $scope.calendarMode = $scope.calendarMode || calendarConfig.calendarMode;
        if (angular.isDefined($attrs.initDate)) {
            self.currentCalendarDate = $scope.$parent.$eval($attrs.initDate);
        }
        if (!self.currentCalendarDate) {
            self.currentCalendarDate = new Date();
            if ($attrs.ngModel && !$scope.$parent.$eval($attrs.ngModel)) {
                $parse($attrs.ngModel).assign($scope.$parent, self.currentCalendarDate);
            }
        }

        self.init = function (ngModelCtrl_) {
            ngModelCtrl = ngModelCtrl_;

            ngModelCtrl.$render = function () {
                self.render();
            };
        };

        self.render = function () {
            if (ngModelCtrl.$modelValue) {
                var date = new Date(ngModelCtrl.$modelValue),
                    isValid = !isNaN(date);

                if (isValid) {
                    this.currentCalendarDate = date;
                } else {
                    $log.error('"ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                }
                ngModelCtrl.$setValidity('date', isValid);
            }
            this.refreshView();
        };

        self.refreshView = function () {
            if (this.mode) {
                this.range = this._getRange(this.currentCalendarDate);
                this._refreshView();
                this.rangeChanged();
            }
        };

        // Split array into smaller arrays
        self.split = function (arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        };

        self.onEventSourceChanged = function (value) {
            self.eventSource = value;
            if (self._onDataLoaded) {
                self._onDataLoaded();
            }
        };

        $scope.loadEvents = function () {
            $scope.eventSource = createRandomEvents;
        };

        $scope.move = function (direction) {
            var step = self.mode.step,
                currentCalendarDate = self.currentCalendarDate,
                year = currentCalendarDate.getFullYear() + direction * (step.years || 0),
                month = currentCalendarDate.getMonth() + direction * (step.months || 0),
                date = currentCalendarDate.getDate() + direction * (step.days || 0),
                firstDayInNextMonth;

            currentCalendarDate.setFullYear(year, month, date);
            if ($scope.calendarMode === 'month') {
                firstDayInNextMonth = new Date(year, month + 1, 1);
                if (firstDayInNextMonth.getTime() <= currentCalendarDate.getTime()) {
                    self.currentCalendarDate = new Date(firstDayInNextMonth - 24 * 60 * 60 * 1000);
                }
            }
            ngModelCtrl.$setViewValue(self.currentCalendarDate);
            self.refreshView();
        };

        self.move = function (direction) {
            $scope.move(direction);
        };

        self.rangeChanged = function () {
            if (self.queryMode === 'local') {
                if (self.eventSource && self._onDataLoaded) {
                    self._onDataLoaded();
                }
            } else if (self.queryMode === 'remote') {
                if ($scope.rangeChanged) {
                    $scope.rangeChanged({
                        startTime: this.range.startTime,
                        endTime: this.range.endTime,
                    });
                }
            }
        };
        scsFamilyData.getCalendarData().then(function(data){
            console.log('calendar data outside ', data.d.results);
        });

        function createRandomEvents() {
            var events = [];
            console.log('in foo ');
            scsFamilyData.getCalendarData().then(function(data){
                console.log('calendar data ', data.d.results);
            });
            for (var i = 0; i < 50; i += 1) {
                var date = new Date();
                var eventType = Math.floor(Math.random() * 2);
                var startDay = Math.floor(Math.random() * 90) - 45;
                var endDay = Math.floor(Math.random() * 2) + startDay;
                var startTime;
                var endTime;
                if (eventType === 0) {
                    startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                    if (endDay === startDay) {
                        endDay += 1;
                    }
                    endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                    events.push({
                        title: 'All Day - ' + i,
                        eventText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        startTime: startTime,
                        endTime: endTime,
                        allDay: true,
                    });
                } else {
                    var startMinute = Math.floor(Math.random() * 24 * 60);
                    var endMinute = Math.floor(Math.random() * 180) + startMinute;
                    startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                    endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                    events.push({
                        title: 'Event name - ' + i,
                        eventText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false,
                    });
                }
            }
            return events;
        }

        function overlap(event1, event2) {
            var earlyEvent = event1,
                lateEvent = event2;
            if (event1.startIndex > event2.startIndex || (event1.startIndex === event2.startIndex && event1.startOffset > event2.startOffset)) {
                earlyEvent = event2;
                lateEvent = event1;
            }

            if (earlyEvent.endIndex <= lateEvent.startIndex) {
                return false;
            } else {
                return !(earlyEvent.endIndex - lateEvent.startIndex === 1 && earlyEvent.endOffset + lateEvent.startOffset >= self.hourParts);
            }
        }

        function calculatePosition(events) {
            var i,
                j,
                len = events.length,
                maxColumn = 0,
                col,
                isForbidden = new Array(len);

            for (i = 0; i < len; i += 1) {
                for (col = 0; col < maxColumn; col += 1) {
                    isForbidden[col] = false;
                }
                for (j = 0; j < i; j += 1) {
                    if (overlap(events[i], events[j])) {
                        isForbidden[events[j].position] = true;
                    }
                }
                for (col = 0; col < maxColumn; col += 1) {
                    if (!isForbidden[col]) {
                        break;
                    }
                }
                if (col < maxColumn) {
                    events[i].position = col;
                } else {
                    events[i].position = maxColumn++;
                }
            }
        }

        function calculateWidth(orderedEvents, hourParts) {
            var totalSize = 24 * hourParts,
                cells = new Array(totalSize),
                event,
                index,
                i,
                j,
                len,
                eventCountInCell,
                currentEventInCell;

            //sort by position in descending order, the right most columns should be calculated first
            orderedEvents.sort(function (eventA, eventB) {
                return eventB.position - eventA.position;
            });
            for (i = 0; i < totalSize; i += 1) {
                cells[i] = {
                    calculated: false,
                    events: [],
                };
            }
            len = orderedEvents.length;
            for (i = 0; i < len; i += 1) {
                event = orderedEvents[i];
                index = event.startIndex * hourParts + event.startOffset;
                while (index < event.endIndex * hourParts - event.endOffset) {
                    cells[index].events.push(event);
                    index += 1;
                }
            }

            i = 0;
            while (i < len) {
                event = orderedEvents[i];
                if (!event.overlapNumber) {
                    var overlapNumber = event.position + 1;
                    event.overlapNumber = overlapNumber;
                    var eventQueue = [event];
                    while ((event = eventQueue.shift())) {
                        index = event.startIndex * hourParts + event.startOffset;
                        while (index < event.endIndex * hourParts - event.endOffset) {
                            if (!cells[index].calculated) {
                                cells[index].calculated = true;
                                if (cells[index].events) {
                                    eventCountInCell = cells[index].events.length;
                                    for (j = 0; j < eventCountInCell; j += 1) {
                                        currentEventInCell = cells[index].events[j];
                                        if (!currentEventInCell.overlapNumber) {
                                            currentEventInCell.overlapNumber = overlapNumber;
                                            eventQueue.push(currentEventInCell);
                                        }
                                    }
                                }
                            }
                            index += 1;
                        }
                    }
                }
                i += 1;
            }
        }

        self.placeEvents = function (orderedEvents) {
            calculatePosition(orderedEvents);
            calculateWidth(orderedEvents, self.hourParts);
        };

        self.placeAllDayEvents = function (orderedEvents) {
            calculatePosition(orderedEvents);
        };
    },
])