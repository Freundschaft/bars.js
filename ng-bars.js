'use strict';

angular.module('bars', [])
    .directive('barGroup', function ($window, $timeout) {
        return {
            replace: false,
            scope: {
                source: '='
            },
            link: function (scope, element, attrs, controller) {
                scope.element = element;
                var refreshBars = function () {
                    scope.bars = [];
                    var barElements = scope.element.children(),
                        replaceElement = angular.element('<div class="bar_group"></div>'),
                        maxValue = attrs.max || 0;
                    if (scope.source) {
                        scope.bars = scope.source;
                    } else {
                        angular.forEach(barElements, function (barElement) {
                            var barValue = parseFloat(barElement.attributes['value'].nodeValue);
                            var newBar = {value: barValue};
                            if (barElement.attributes['label']) {
                                newBar.label = barElement.attributes['label'].nodeValue;
                            }
                            if (barElement.attributes['show-values']) {
                                newBar.showValues = true;
                            }
                            if (barElement.attributes['tooltip']) {
                                newBar.tooltip = true;
                            }
                            if (barElement.attributes['unit']) {
                                newBar.unit = barElement.attributes['unit'].nodeValue;
                            }
                            if (barElement.attributes['class']) {
                                newBar.class = barElement.attributes['class'].nodeValue;
                            }

                            scope.bars.push(newBar);
                        });
                    }


                    angular.forEach(scope.bars, function (bar) {
                        var barElement = angular.element('<div class="bar_group__bar"></div>');

                        if (bar.class) {
                            barElement.addClass(bar.class);
                        }
                        if (bar.label) {
                            replaceElement.append('<p class="b_label">' + bar.label + '</p>');
                        }

                        if (bar.tooltip) {
                            barElement.css('margin-bottom', '40px');
                            barElement.append('<div class="b_tooltip"><span>' + bar.value + '</span><div class="b_tooltip--tri"></div></div>');
                        }
                        if (bar.showValues) {
                            barElement.css('margin-bottom', '40px');
                            if (bar.unit) {
                                barElement.append('<p class="bar_label_min">0 ' + bar.unit + '</p>');
                                barElement.append('<p class="bar_label_max">' + maxValue + ' ' + bar.unit + '</p>');
                            } else {
                                barElement.append('<p class="bar_label_min">0</p>');
                                barElement.append('<p class="bar_label_max">' + maxValue + '</p>');
                            }
                        }
                        bar.element = barElement;
                        replaceElement.append(barElement);

                        if (maxValue < bar.value) {
                            maxValue = bar.value;
                        }
                    });
                    scope.element.empty();
                    scope.element.append(replaceElement);

                    $timeout(function () {
                        angular.forEach(scope.bars, function (bar) {
                            var docViewTop = $window.pageYOffset;
                            var docViewBottom = docViewTop + $window.innerHeight;
                            var elemTop = bar.element[0].getBoundingClientRect().top + docViewTop;
                            var elemBottom = elemTop + bar.element[0].offsetHeight;
                            if (docViewBottom > elemBottom - 45) {
                                bar.element.css('width', bar.value / maxValue * 100 + '%');
                            }
                        });
                    }, 0);
                };

                refreshBars();

                scope.$watch('source', function (newValue, oldValue) {
                    if (!!newValue) {
                        refreshBars();
                    }
                });

            }
        };
    });
