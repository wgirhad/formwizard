/*
The MIT License (MIT)

Copyright (c) 2015 wgirhad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function($){

"use strict";

$.fn.formWizard = function() {
    this.each(function(){
        new FormWizard($(this));
    });

    return this;
};

$.fn.fwInputHide = function() {
    this.each(function(){
        var what = this.dataset.fwVisibility || "hide";

        if (what == "disable") {
            $(this).attr("disabled", "disabled");
            $(this).prop("disabled", "disabled");
        }

        if (what == "hide") {
            $(this).hide();
        }
    });

    return this;
};

$.fn.fwInputShow = function() {
    this.each(function(){
        var what = this.dataset.fwVisibility || "hide";

        if (what == "disable") {
            $(this).attr("disabled", false);
            $(this).prop("disabled", false);
        }

        if (what == "hide") {
            $(this).show();
        }
    });

    return this;
};

$(".fw-container").formWizard();

//Class
// elem must be a jQuery object
function FormWizard(elem) {
    var
        _obj = {},
        _labels = {},
        _tabs,
        _nTabs,
        _actualTab,
        _prevBtn,
        _nextBtn,
        _submitBtn;

    _tabs  = elem.find(".fw-tab");
    _nTabs = _tabs.length;
    _actualTab = _tabs.index(elem.find(".fw-tab.fw-active"));

    _nextBtn = elem.find(".fw-next").click(Next);
    _prevBtn = elem.find(".fw-prev").click(Prev);
    _submitBtn = elem.find(".fw-submit");

    elem.find(".fw-goto").click(GoToClick);
    elem.find(".fw-goto-label").click(GoToLabelClick);

    _obj.Next = Next;
    _obj.Prev = Prev;
    _obj.First = First;
    _obj.Last = Last;
    _obj.GoTo = GoTo;

    indexLabels();
    updateView();

    function indexLabels() {
        _tabs.each(function(i) {
            if ("fwLabel" in this.dataset) {
                _labels[this.dataset.fwLabel] = i;
            }
        });
    }

    function Next() {
        if (_actualTab >= _nTabs-1) return elem;
        _actualTab++;
        return updateView();
    }

    function Prev() {
        if (_actualTab <= 0) return elem;
        _actualTab--;
        return updateView();
    }

    function First() {
        if (_actualTab == 0) return elem;
        _actualTab = 0;
        return updateView();
    }

    function Last() {
        if (_actualTab == _nTabs-1) return elem;
        _actualTab = _nTabs-1;
        return updateView();
    }

    function GoToClick(e) {
        return GoTo(this.dataset.fwGoto);
    }

    function GoToLabelClick(e) {
        return GoToLabel(this.dataset.fwGoto);
    }

    function GoToLabel(label) {
        return GoTo(_labels[label]);
    }

    function GoTo(n) {
        if (_actualTab == n) return elem;
        _actualTab = Math.max(Math.min(n, _nTabs-1), 0);
        return updateView();
    }

    function updateView() {
        hideShowNextPrev();
        hideShowElements();
        hideShowTabs();
        classSwitcher();

        return elem;
    }

    function hideShowElements() {
        elem.find("[data-fw-visible-on]")
            .fwInputHide()
            .filter("[data-fw-visible-on=\"" + _actualTab + "\"]")
            .fwInputShow();

        elem.find("[data-fw-hidden-on]")
            .fwInputShow()
            .filter("[data-fw-hidden-on=\"" + _actualTab + "\"]")
            .fwInputHide();

        // Regra para "last"
        if (_actualTab < _nTabs - 1) return false;

        elem.find("[data-fw-visible-on]")
            .fwInputHide()
            .filter("[data-fw-visible-on=\"last\"]")
            .fwInputShow();

        elem.find("[data-fw-hidden-on]")
            .fwInputShow()
            .filter("[data-fw-hidden-on=\"last\"]")
            .fwInputHide();
    }

    function hideShowTabs() {
        _tabs.hide();
        _tabs.eq(_actualTab).show();
    }

    function hideShowNextPrev() {
        if (_actualTab <= 0) {
            _prevBtn.fwInputHide();
        } else {
            _prevBtn.fwInputShow();
        }

        if (_actualTab >= _nTabs-1) {
            _nextBtn.fwInputHide();
        } else {
            _nextBtn.fwInputShow();
        }
    }

    function classSwitcher() {
        elem.find(".fw-class").each(function() {
            var insertsDefault = true;
            var _par = this.dataset.fwClass.split(';');
            var _def = _par.pop();
            var $jq = $(this);
            var helper;

            $jq.removeClass(_def);

            for (var i in _par) {
                helper = _par[i].split(":");

                if (helper[1] == _actualTab) {
                    insertsDefault = false;
                    $jq.addClass(helper[0]);
                } else {
                    $jq.removeClass(helper[0]);
                }
            }

            if (insertsDefault) {
                $jq.addClass(_def);
            }
        });
    }

    return _obj;
}

}(jQuery));