var pageItemProperties = {
    flip: {
        type: "Flip",
        description: "The direction in which to flip the printed image",
        labels: ["flip", "direction"],
        key: ["flip"],
        possibleValues: {
            constants: [{
                labels: ["horizontal", "vertical", "rotate", "180"],
                value: "Flip.BOTH",
                description: "Horizontal and vertical flip (same as rotate 180)"
            }, {
                labels: ["horizontal", "mirror"],
                value: "Flip.HORIZONTAL",
                description: "Flips the printed image horizontally"
            }, {
                labels: ["horizontal", "vertical", "rotate", "180"],
                value: "Flip.HORIZONTAL_AND_VERTICAL",
                description: "Flips the printed image horizontally and vertically (same as rotate 180)"
            }, {
                labels: ["none", "straight"],
                value: "Flip.NONE",
                description: "The printed image is not flipped"
            }, {
                labels: ["vertical", "mirror"],
                value: "Flip.VERTICAL",
                description: "Flips the printed image vertically"
            }]
        }
    },
    visibleBounds: {
        type: "Number",
        description: "The bounds of the PageItem including the stroke width, in the format [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.",
        key: ["visibleBounds"],
        possibleValues: {
            arrayLength: 4
        }
    },
    visible: {
        type: "Boolean",
        description: "If true, the PageItem is visible.",
        key: ["visible"],
        possibleValues: {
            constants: [{
                value: true
            }, {
                value: false
            }]
        }
    },
    anchorPoint: {
        property: "anchorPoint",
        type: "AnchorPoint",
        description: "The point in the anchored object to position.",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "anchorPoint"],
        possibleValues: {
            constants: [{
                value: "AnchorPoint.BOTTOM_CENTER_ANCHOR",
                description: "The center point on the bottom of the bounding box"
            }, {
                value: "AnchorPoint.BOTTOM_LEFT_ANCHOR",
                description: "The bottom left corner"
            }, {
                value: "AnchorPoint.BOTTOM_RIGHT_ANCHOR",
                description: "The bottom right corner"
            }, {
                value: "AnchorPoint.CENTER_ANCHOR",
                description: "The center point in the bounding box"
            }, {
                value: "AnchorPoint.LEFT_CENTER_ANCHOR",
                description: "The center point on the left side of the bounding box"
            }, {
                value: "AnchorPoint.RIGHT_CENTER_ANCHOR",
                description: "The center point on the right side of the bounding box"
            }, {
                value: "AnchorPoint.TOP_CENTER_ANCHOR",
                description: "The center point on the top of the bounding box"
            }, {
                value: "AnchorPoint.TOP_LEFT_ANCHOR",
                description: "The top left corner"
            }, {
                value: "AnchorPoint.TOP_RIGHT_ANCHOR",
                description: "The top right corner"
            }]
        }
    },
    anchorYoffset: {
        property: "anchorYoffset",
        type: "Number",
        description: "The vertical (y) offset of the anchored object. Corresponds to the space after property for above line positioning.",
        key: ["appliedObjectStyle", "anchoredObjectSettings","anchorYoffset"],
        possibleValues: {
            from: Number.MAX_SAFE_INTEGER,
            to: Number.MIN_SAFE_INTEGER
        }
    },
    anchoredPosition: {
        property: "anchoredPosition",
        type: "AnchorPosition",
        description: "The position of the anchored object relative to the anchor.",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "anchoredPosition"],
        possibleValues: {
            constants: [{
                value: "AnchorPosition.ABOVE_LINE",
                description: "Place the anchored object above the line of text that contains the object"
            }, {
                value: "AnchorPosition.ANCHORED",
                description: "Custom anchor position"
            }, {
                value: "AnchorPosition.INLINE_POSITION",
                description: "Align the anchored object with the baseline of the line that contains the object"
            }]
        }
    },
    horizontalAlignment: {
        type: "HorizontalAlignment",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "horizontalAlignment"],
        description: "When anchored position is above line, the position of the anchored object is relative to the text area. When anchored position is custom, the horizontal alignment of the anchored object is set by the horizontal reference point. Note: Not valid when anchored position is inline.",
        possibleValues: {
            constants: [{
                value: "HorizontalAlignment.CENTER_ALIGN",
                description: "Place the anchored object at the center of the reference"
            }, {
                value: "HorizontalAlignment.LEFT_ALIGN",
                description: "Place the anchored object to the left of the reference"
            }, {
                value: "HorizontalAlignment.RIGHT_ALIGN",
                description: "Place the anchored object to the right of the reference"
            }, {
                value: "HorizontalAlignment.TEXT_ALIGN",
                description: "Place the anchored object relative to the text alignment"
            }]
        }
    },
    horizontalReferencePoint: {
        type: "AnchoredRelativeTo",
        description: "The horizontal reference point on the page. Valid only when anchored position is custom.",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "horizontalReferencePoint"],
        possibleValues: {
            constants: [{
                value: "AnchoredRelativeTo.ANCHOR_LOCATION",
                description: "Align the anchored object to the anchor"
            }, {
                value: "AnchoredRelativeTo.COLUMN_EDGE",
                description: "Align the anchored object to the edge of the text or table column"
            }, {
                value: "AnchoredRelativeTo.PAGE_EDGE",
                description: "Align the anchored object to the edge of the page"
            }, {
                value: "AnchoredRelativeTo.PAGE_MARGINS",
                description: "Align the anchored object to the page margin"
            }, {
                value: "AnchoredRelativeTo.TEXT_FRAME",
                description: "Align the anchored object to the edge of the text frame"
            }]
        }
    },
    spineRelative: {
        type: "Boolean",
        description: "If true, the position of the anchored object is relative to the binding spine of the page or spread.",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "spineRelative"],
        possibleValues: {
            constants: [{
                value: true
            }, {
                value: false
            }]
        }
    },
    verticalAlignment: {
        type: "VerticalAlignment",
        description: "The vertical alignment of the anchored object reference point with the vertical reference point on the page. Notes: Valid only when anchored position is custom.",
        key: ["appliedObjectStyle", "anchoredObjectSettings", "verticalAlignment"],
        possibleValues: {
            constants: [{
                value: "VerticalAlignment.BOTTOM_ALIGN",
                description: "Place the anchored object at the bottom of the vertical reference point"
            }, {
                value: "VerticalAlignment.CENTER_ALIGN",
                description: "Place the anchored object at the vertical center of the vertical reference point"
            }, {
                value: "VerticalAlignment.TOP_ALIGN",
                description: "Place the anchored object at the top of the vertical reference point"
            }]
        }
    },
    verticalReferencePoint: {
        type: "VerticallyRelativeTo",
        description: "The vertical reference point on the page. Valid when anchored position is custom.",
        key: ["appliedObjectStyle", "anchoredObjectSettings","verticalReferencePoint"],
        possibleValues: {
            constants: [{
                value: "VerticallyRelativeTo.CAPHEIGHT",
                description: "Align the anchored object to the top of capital letters"
            }, {
                value: "VerticallyRelativeTo.COLUMN_EDGE",
                description: "Align the anchored object to the edge of the text or table column"
            }, {
                value: "VerticallyRelativeTo.EMBOX_BOTTOM",
                description: "Align the anchored object to the bottom of the embox"
            }, {
                value: "VerticallyRelativeTo.EMBOX_MIDDLE",
                description: "Align the anchored object to the middle of the embox"
            }, {
                value: "VerticallyRelativeTo.EMBOX_TOP",
                description: "Align the anchored object to the top of the embox"
            }, {
                value: "VerticallyRelativeTo.LINE_ASCENT",
                description: "Align the anchored object to the top of the tallest letters in the text"
            }, {
                value: "VerticallyRelativeTo.LINE_BASELINE",
                description: "Align the anchored object to the baseline of the line of text"
            }, {
                value: "VerticallyRelativeTo.LINE_XHEIGHT",
                description: "Align the anchored object to the top of lower case letters with no ascent, such as x"
            }, {
                value: "VerticallyRelativeTo.PAGE_EDGE",
                description: "Align the anchored object to the edge of the page"
            }, {
                value: "VerticallyRelativeTo.PAGE_MARGINS",
                description: "Align the anchored object to the page margin"
            }, {
                value: "VerticallyRelativeTo.TEXT_FRAME",
                description: "Align the anchored object to the edge of the text frame"
            }, {
                value: "VerticallyRelativeTo.TOP_OF_LEADING",
                description: "Align the anchored object to the top of the text leading"
            }]
        }
    },
    warichu: {
        type: "Boolean",
        description: "If true, turns on warichu.",
        key: ["appliedObjectStyle", "appliedParagraphStyle","warichu"],
        possibleValues: {
            constants: [{
                value: true
            }, {
                value: false
            }]
        }
    },
    dictionaryPaths: {
        property: "dictionaryPaths",
        type: "String",
        description: "The user dictionaries for the language.",
        key: ["appliedObjectStyle", "appliedParagraphStyle", "dictionaryPaths"],
        possibleValues: {
            arrayLength: "Number.MAX_SAFE_INTEGER"
        }
    },
    appliedNumberingList: {
        type: "NumberingList",
        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedNumberingList"],
        description: "The list to be part of. Can return: NumberingList or String.",
        possibleValues: {
            continueNumbersAcrossStories: {
                type: "Boolean",
                description: "If true, numbering will continue across stories.",
                key: ["appliedObjectStyle", "appliedParagraphStyle","appliedNumberingList","continueNumbersAcrossStories"],
                possibleValues: {
                    constants: [{
                        value: true
                    }, {
                        value: false
                    }]
                }
            }
        }
    },




    appliedObjectStyle: {
        description: "The object style applied to the PageItem.",
        key: ["appliedObjectStyle"],
        possibleValues: {

            "ParagraphStyle": {
                property: "appliedParagraphStyle",
                type: "ParagraphStyle",
                key: ["appliedObjectStyle", "appliedParagraphStyle"],
                description: "The paragraph style applied to the text. Can also accept: String.",
                possibleValues: {




                    "Number Range": {
                        property: "underlineTint",
                        type: "Number Range",
                        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                        description: "The underline stroke tint (as a percentage). (Range: 0 to 100)",
                        possibleValues: {
                            "from": 0,
                            "to": 100
                        }
                    },
                    "Number": {
                        property: "yOffsetDiacritic",
                        type: "Number",
                        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                        description: "The y (vertical) offset for diacritic adjustment.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "ListAlignment": {
                        property: "numberingAlignment",
                        type: "ListAlignment",
                        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                        description: "The alignment of the number.",
                        possibleValues: {
                            constants: [{
                                value: "ListAlignment.CENTER_ALIGN",
                                description: "Align center"
                            }, {
                                value: "ListAlignment.LEFT_ALIGN",
                                description: "Align left"
                            }, {
                                value: "ListAlignment.RIGHT_ALIGN",
                                description: "Align right"
                            }]
                        }
                    },
                    "ListType": {
                        property: "bulletsAndNumberingListType",
                        type: "ListType",
                        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                        description: "List type for bullets and numbering.",
                        possibleValues: {
                            constants: [{
                                value: "ListType.BULLET_LIST",
                                description: "Bullet list"
                            }, {
                                value: "ListType.NO_LIST",
                                description: "No list"
                            }, {
                                value: "ListType.NUMBERED_LIST",
                                description: "Numbered list"
                            }]
                        }
                    },
                    "CharacterStyle": {
                        property: "numberingCharacterStyle",
                        type: "CharacterStyle",
                        key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                        description: "The character style to be used for the number string. Can return: CharacterStyle or String.",
                        possibleValues: {
                            "Unit": {
                                property: "underlineWeight",
                                type: "Unit",

                                description: "The stroke weight of the underline stroke. Can return: Unit or NothingEnum enumerator.",
                                possibleValues: {
                                    "from": "Number.MAX_SAFE_INTEGER",
                                    "to": "Number.MIN_SAFE_INTEGER"
                                }
                            },
                            "Capitalization": {
                                property: "capitalization",
                                type: "Capitalization",
                                key: ["appliedObjectStyle", "appliedParagraphStyle","appliedLanguage"],
                                description: "The capitalization scheme. Can return: Capitalization enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "Capitalization.ALL_CAPS",
                                        description: "Use all uppercase letters"
                                    }, {
                                        value: "Capitalization.CAP_TO_SMALL_CAP",
                                        description: "Use OpenType small caps"
                                    }, {
                                        value: "Capitalization.NORMAL",
                                        description: "Do not change the capitalization of the text"
                                    }, {
                                        value: "Capitalization.SMALL_CAPS",
                                        description: "Use small caps for lowercase letters"
                                    }]
                                }
                            },
                            "CharacterAlignment": {
                                property: "characterAlignment",
                                type: "CharacterAlignment",

                                description: "The alignment of small characters to the largest character in the line. Can return: CharacterAlignment enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "CharacterAlignment.ALIGN_BASELINE",
                                        description: "Aligns small characters in a line to the large character"
                                    }, {
                                        value: "CharacterAlignment.ALIGN_EM_BOTTOM",
                                        description: "Aligns small characters in horizontal text to the bottom of the em box of large characters In vertical text, aligns characters to the left of the em box."
                                    }, {
                                        value: "CharacterAlignment.ALIGN_EM_CENTER",
                                        description: "Aligns small characters to the center of the em box of large characters"
                                    }, {
                                        value: "CharacterAlignment.ALIGN_EM_TOP",
                                        description: "Aligns small characters in horizontal text to the top of the em box of large characters In vertical text, aligns characters to the right of the em box."
                                    }, {
                                        value: "CharacterAlignment.ALIGN_ICF_BOTTOM",
                                        description: "Aligns small characters in horizontal text to the bottom of the ICF of large characters In vertical text, aligns characters to the left of the ICF."
                                    }, {
                                        value: "CharacterAlignment.ALIGN_ICF_TOP",
                                        description: "Aligns small characters in horizontal text to the top of the ICF of large characters In vertical text, aligns characters to the right of the ICF."
                                    }]
                                }
                            },
                            "CharacterDirectionOptions": {
                                property: "keyboardDirection",
                                type: "CharacterDirectionOptions",

                                description: "The keyboard direction of the character. Can return: CharacterDirectionOptions enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "CharacterDirectionOptions.DEFAULT_DIRECTION",
                                        description: "Default direction"
                                    }, {
                                        value: "CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION",
                                        description: "Left to right direction"
                                    }, {
                                        value: "CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION",
                                        description: "Right to left direction"
                                    }]
                                }
                            },
                            "Real": {
                                property: "yOffsetDiacritic",
                                type: "Real",

                                description: "The y (vertical) offset for diacritic adjustment. Can return: Real or NothingEnum enumerator.",
                                possibleValues: {
                                    "from": "Number.MAX_SAFE_INTEGER",
                                    "to": "Number.MIN_SAFE_INTEGER"
                                }
                            },
                            "Boolean": {
                                property: "warichu",
                                type: "Boolean",

                                description: "If true, turns on warichu. Can return: Boolean or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: true
                                    }, {
                                        value: false
                                    }]
                                }
                            },
                            "Reals": {
                                property: "designAxes",
                                type: "Reals",

                                description: "Value of Design Axes. Can return: Array of Reals or NothingEnum enumerator.",
                                possibleValues: {
                                    arrayLength: "Number.MAX_SAFE_INTEGER"
                                }
                            },
                            "DiacriticPositionOptions": {
                                property: "diacriticPosition",
                                type: "DiacriticPositionOptions",

                                description: "Position of diacriticical characters. Can return: DiacriticPositionOptions enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "DiacriticPositionOptions.DEFAULT_POSITION",
                                        description: "Default position"
                                    }, {
                                        value: "DiacriticPositionOptions.LOOSE_POSITION",
                                        description: "Loose position"
                                    }, {
                                        value: "DiacriticPositionOptions.MEDIUM_POSITION",
                                        description: "Medium position"
                                    }, {
                                        value: "DiacriticPositionOptions.OPENTYPE_POSITION",
                                        description: "OpenType position"
                                    }, {
                                        value: "DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE",
                                        description: "OpenType position from baseline"
                                    }, {
                                        value: "DiacriticPositionOptions.TIGHT_POSITION",
                                        description: "Tight position"
                                    }]
                                }
                            },
                            "DigitsTypeOptions": {
                                property: "digitsType",
                                type: "DigitsTypeOptions",

                                description: "The digits type. Can return: DigitsTypeOptions enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "DigitsTypeOptions.ARABIC_DIGITS",
                                        description: "Arabic digits"
                                    }, {
                                        value: "DigitsTypeOptions.BENGALI_DIGITS",
                                        description: "Bengali digits"
                                    }, {
                                        value: "DigitsTypeOptions.BURMESE_DIGITS",
                                        description: "Burmese digits"
                                    }, {
                                        value: "DigitsTypeOptions.DEFAULT_DIGITS",
                                        description: "Default digits"
                                    }, {
                                        value: "DigitsTypeOptions.DEVANAGARI_DIGITS",
                                        description: "Devanagari digits"
                                    }, {
                                        value: "DigitsTypeOptions.FARSI_DIGITS",
                                        description: "Farsi digits"
                                    }, {
                                        value: "DigitsTypeOptions.FULL_FARSI_DIGITS",
                                        description: "Full Farsi digits"
                                    }, {
                                        value: "DigitsTypeOptions.GUJARATI_DIGITS",
                                        description: "Gujarati digits"
                                    }, {
                                        value: "DigitsTypeOptions.GURMUKHI_DIGITS",
                                        description: "Gurmukhi digits"
                                    }, {
                                        value: "DigitsTypeOptions.HINDI_DIGITS",
                                        description: "Hindi digits"
                                    }, {
                                        value: "DigitsTypeOptions.KANNADA_DIGITS",
                                        description: "Kannada digits"
                                    }, {
                                        value: "DigitsTypeOptions.KHMER_DIGITS",
                                        description: "Khmer digits"
                                    }, {
                                        value: "DigitsTypeOptions.LAO_DIGITS",
                                        description: "Lao digits"
                                    }, {
                                        value: "DigitsTypeOptions.MALAYALAM_DIGITS",
                                        description: "Malayalam digits"
                                    }, {
                                        value: "DigitsTypeOptions.NATIVE_DIGITS",
                                        description: "native digits"
                                    }, {
                                        value: "DigitsTypeOptions.ORIYA_DIGITS",
                                        description: "Oriya digits"
                                    }, {
                                        value: "DigitsTypeOptions.TAMIL_DIGITS",
                                        description: "Tamil digits"
                                    }, {
                                        value: "DigitsTypeOptions.TELUGU_DIGITS",
                                        description: "Telugu digits"
                                    }, {
                                        value: "DigitsTypeOptions.THAI_DIGITS",
                                        description: "Thai digits"
                                    }, {
                                        value: "DigitsTypeOptions.TIBETAN_DIGITS",
                                        description: "Tibetan digits"
                                    }]
                                }
                            },
                            "OutlineJoin": {
                                property: "endJoin",
                                type: "OutlineJoin",

                                description: "The stroke join type applied to the characters of the text. Can return: OutlineJoin enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "OutlineJoin.BEVEL_END_JOIN",
                                        description: "Beveled end join"
                                    }, {
                                        value: "OutlineJoin.MITER_END_JOIN",
                                        description: "Miter end join"
                                    }, {
                                        value: "OutlineJoin.ROUND_END_JOIN",
                                        description: "Rounded end join"
                                    }]
                                }
                            },
                            "Number Range": {
                                property: "underlineTint",
                                type: "Number Range",

                                description: "The underline stroke tint (as a percentage). (Range: 0 to 100). Can return: Real or NothingEnum enumerator.",
                                possibleValues: {
                                    "from": 0,
                                    "to": 100
                                }
                            },
                            "AlternateGlyphForms": {
                                property: "glyphForm",
                                type: "AlternateGlyphForms",

                                description: "The glyph variant to substitute for standard glyphs. Can return: AlternateGlyphForms enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "AlternateGlyphForms.EXPERT_FORM",
                                        description: "Uses the expert variant"
                                    }, {
                                        value: "AlternateGlyphForms.FULL_WIDTH_FORM",
                                        description: "Uses the full-width variant"
                                    }, {
                                        value: "AlternateGlyphForms.JIS04_FORM",
                                        description: "Uses the JIS04 variant"
                                    }, {
                                        value: "AlternateGlyphForms.JIS78_FORM",
                                        description: "Uses the JIS78 variant"
                                    }, {
                                        value: "AlternateGlyphForms.JIS83_FORM",
                                        description: "Uses the JIS83 variant"
                                    }, {
                                        value: "AlternateGlyphForms.JIS90_FORM",
                                        description: "Uses the JIS90 variant"
                                    }, {
                                        value: "AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM",
                                        description: "Uses the monospaced half-width variant"
                                    }, {
                                        value: "AlternateGlyphForms.NLC_FORM",
                                        description: "Uses the NLC variant"
                                    }, {
                                        value: "AlternateGlyphForms.NONE",
                                        description: "Does not use an alternate form"
                                    }, {
                                        value: "AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM",
                                        description: "Substitutes proportional glyphs for half-width and full-width glyphs"
                                    }, {
                                        value: "AlternateGlyphForms.QUARTER_WIDTH_FORM",
                                        description: "Uses the quarter-width variant"
                                    }, {
                                        value: "AlternateGlyphForms.THIRD_WIDTH_FORM",
                                        description: "Uses the third-width variant"
                                    }, {
                                        value: "AlternateGlyphForms.TRADITIONAL_FORM",
                                        description: "Uses the traditional variant"
                                    }]
                                }
                            },
                            "KashidasOptions": {
                                property: "kashidas",
                                type: "KashidasOptions",

                                description: "Use of Kashidas for justification. Can return: KashidasOptions enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "KashidasOptions.DEFAULT_KASHIDAS",
                                        description: "Default kashidas"
                                    }, {
                                        value: "KashidasOptions.KASHIDAS_OFF",
                                        description: "Kashidas off"
                                    }]
                                }
                            },
                            "KentenAlignment": {
                                property: "kentenAlignment",
                                type: "KentenAlignment",

                                description: "The alignment of kenten characters relative to the parent characters. . Can return: KentenAlignment enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "KentenAlignment.ALIGN_KENTEN_CENTER",
                                        description: "Aligns kenten with the center of parent charactrers"
                                    }, {
                                        value: "KentenAlignment.ALIGN_KENTEN_LEFT",
                                        description: "Aligns kenten with the left of parent characters"
                                    }]
                                }
                            },
                            "KentenCharacterSet": {
                                property: "kentenCharacterSet",
                                type: "KentenCharacterSet",

                                description: "The character set used for the custom kenten character. Note: Valid only when kenten kind is custom. . Can return: KentenCharacterSet enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "KentenCharacterSet.CHARACTER_INPUT",
                                        description: "Character input"
                                    }, {
                                        value: "KentenCharacterSet.JIS",
                                        description: "JIS"
                                    }, {
                                        value: "KentenCharacterSet.KUTEN",
                                        description: "Kuten"
                                    }, {
                                        value: "KentenCharacterSet.SHIFT_JIS",
                                        description: "Shift JIS"
                                    }, {
                                        value: "KentenCharacterSet.UNICODE",
                                        description: "Unicode"
                                    }]
                                }
                            },
                            "KentenCharacter": {
                                property: "kentenKind",
                                type: "KentenCharacter",

                                description: "The style of kenten characters. Can return: KentenCharacter enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "KentenCharacter.CUSTOM",
                                        description: "Uses a custom kenten style"
                                    }, {
                                        value: "KentenCharacter.KENTEN_BLACK_CIRCLE",
                                        description: "Uses the kenten black circle"
                                    }, {
                                        value: "KentenCharacter.KENTEN_BLACK_TRIANGLE",
                                        description: "Uses the kenten black triangle"
                                    }, {
                                        value: "KentenCharacter.KENTEN_BULLSEYE",
                                        description: "Uses the kenten bullseye"
                                    }, {
                                        value: "KentenCharacter.KENTEN_FISHEYE",
                                        description: "Uses the kenten fisheye"
                                    }, {
                                        value: "KentenCharacter.KENTEN_SESAME_DOT",
                                        description: "Uses the kenten sesame dot"
                                    }, {
                                        value: "KentenCharacter.KENTEN_SMALL_BLACK_CIRCLE",
                                        description: "Uses the kenten small black circle"
                                    }, {
                                        value: "KentenCharacter.KENTEN_SMALL_WHITE_CIRCLE",
                                        description: "Uses the kenten small white circle"
                                    }, {
                                        value: "KentenCharacter.KENTEN_WHITE_CIRCLE",
                                        description: "Uses the kenten white circle"
                                    }, {
                                        value: "KentenCharacter.KENTEN_WHITE_SESAME_DOT",
                                        description: "Uses the kenten white sesame dot"
                                    }, {
                                        value: "KentenCharacter.KENTEN_WHITE_TRIANGLE",
                                        description: "Uses the kenten white triangle"
                                    }, {
                                        value: "KentenCharacter.NONE",
                                        description: "Does not use kenten"
                                    }]
                                }
                            },
                            "AdornmentOverprint": {
                                property: "rubyOverprintStroke",
                                type: "AdornmentOverprint",

                                description: "The method of overprinting the ruby stroke. Can return: AdornmentOverprint enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "AdornmentOverprint.AUTO",
                                        description: "Uses auto overprint"
                                    }, {
                                        value: "AdornmentOverprint.OVERPRINT_OFF",
                                        description: "Turns off overprint"
                                    }, {
                                        value: "AdornmentOverprint.OVERPRINT_ON",
                                        description: "Turns on overprint"
                                    }]
                                }
                            },
                            "RubyKentenPosition": {
                                property: "rubyPosition",
                                type: "RubyKentenPosition",

                                description: "The position of ruby characters relative to the parent text. Can return: RubyKentenPosition enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "RubyKentenPosition.ABOVE_RIGHT",
                                        description: "Places kenten or ruby to the right and above the parent character"
                                    }, {
                                        value: "RubyKentenPosition.BELOW_LEFT",
                                        description: "Places kenten or ruby to the left and below the parent character"
                                    }]
                                }
                            },
                            "Leading": {
                                property: "leading",
                                type: "Leading",

                                description: "The leading applied to the text. Can return: Unit, Leading enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "Leading.AUTO",
                                        description: "Apply auto leading"
                                    }]
                                }
                            },
                            "OTFFigureStyle": {
                                property: "otfFigureStyle",
                                type: "OTFFigureStyle",

                                description: "The figure style in OpenType fonts. Can return: OTFFigureStyle enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "OTFFigureStyle.DEFAULT_VALUE",
                                        description: "Use the default figure style for the font"
                                    }, {
                                        value: "OTFFigureStyle.PROPORTIONAL_LINING",
                                        description: "Use proportional width lining figures"
                                    }, {
                                        value: "OTFFigureStyle.PROPORTIONAL_OLDSTYLE",
                                        description: "Use proportional width oldstyle figures"
                                    }, {
                                        value: "OTFFigureStyle.TABULAR_LINING",
                                        description: "Use monspaced lining figures"
                                    }, {
                                        value: "OTFFigureStyle.TABULAR_OLDSTYLE",
                                        description: "Use monospaced oldstyle figures"
                                    }]
                                }
                            },
                            "Position": {
                                property: "position",
                                type: "Position",

                                description: "The text position relative to the baseline. Can return: Position enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "Position.NORMAL",
                                        description: "Normal position"
                                    }, {
                                        value: "Position.OT_DENOMINATOR",
                                        description: "For OpenType fonts, shrinks the text but keeps text on the main text baseline Note: Valid only for numeric characters."
                                    }, {
                                        value: "Position.OT_NUMERATOR",
                                        description: "For OpenType fonts, shrinks the text but keeps the top of the characters aligned with the top of the main text Note: Valid only for numeric characters."
                                    }, {
                                        value: "Position.OT_SUBSCRIPT",
                                        description: "For OpenType fonts, uses--if available--lowered glyphs that are sized correctly relative to the surrounding characters"
                                    }, {
                                        value: "Position.OT_SUPERSCRIPT",
                                        description: "For OpenType fonts, uses--if available--raised glyphs that are sized correctly relative to the surrounding characters"
                                    }, {
                                        value: "Position.SUBSCRIPT",
                                        description: "Subscripts the text"
                                    }, {
                                        value: "Position.SUPERSCRIPT",
                                        description: "Superscripts the text"
                                    }]
                                }
                            },
                            "PositionalForms": {
                                property: "positionalForm",
                                type: "PositionalForms",

                                description: "The OpenType positional form. Can return: PositionalForms enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "PositionalForms.CALCULATE",
                                        description: "Calculated forms"
                                    }, {
                                        value: "PositionalForms.FINAL",
                                        description: "Final form"
                                    }, {
                                        value: "PositionalForms.INITIAL",
                                        description: "Initial form"
                                    }, {
                                        value: "PositionalForms.ISOLATED",
                                        description: "Isolated form"
                                    }, {
                                        value: "PositionalForms.MEDIAL",
                                        description: "Medial form"
                                    }, {
                                        value: "PositionalForms.NONE",
                                        description: "None"
                                    }]
                                }
                            },
                            "Color": {
                                property: "previewColor",
                                type: "Color",

                                description: "The color to use for preview, specified either as an array of three doubles, each in the range 0 to 255 and representing R, G, and B values, or as a UI color. Can return: Array of 3 Reals (0 - 255) or UIColors enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    arrayLength: 3,
                                    "from": 0,
                                    "to": 255
                                }
                            },
                            "RubyAlignments": {
                                property: "rubyAlignment",
                                type: "RubyAlignments",

                                description: "The ruby alignment. Can return: RubyAlignments enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "RubyAlignments.RUBY_1_AKI",
                                        description: "Ruby 1 aki"
                                    }, {
                                        value: "RubyAlignments.RUBY_CENTER",
                                        description: "Centers ruby relative to the parent text"
                                    }, {
                                        value: "RubyAlignments.RUBY_EQUAL_AKI",
                                        description: "Ruby equal aki"
                                    }, {
                                        value: "RubyAlignments.RUBY_FULL_JUSTIFY",
                                        description: "Justifies ruby across the parent text"
                                    }, {
                                        value: "RubyAlignments.RUBY_JIS",
                                        description: "Ruby JIS"
                                    }, {
                                        value: "RubyAlignments.RUBY_LEFT",
                                        description: "Aligns ruby with the left-most character in the parent text"
                                    }, {
                                        value: "RubyAlignments.RUBY_RIGHT",
                                        description: "Aligns ruby with the right-most character in the parent text"
                                    }]
                                }
                            },
                            "RubyOverhang": {
                                property: "rubyParentOverhangAmount",
                                type: "RubyOverhang",

                                description: "The amount by which ruby characters can overhang the parent text. Can return: RubyOverhang enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "RubyOverhang.NONE",
                                        description: "Does not allow ruby overhang"
                                    }, {
                                        value: "RubyOverhang.RUBY_OVERHANG_HALF_CHAR",
                                        description: "Ruby is overhang one-half the size of one chararacter"
                                    }, {
                                        value: "RubyOverhang.RUBY_OVERHANG_HALF_RUBY",
                                        description: "Ruby overhang is one-half ruby"
                                    }, {
                                        value: "RubyOverhang.RUBY_OVERHANG_NO_LIMIT",
                                        description: "There is no ruby overhang size limit"
                                    }, {
                                        value: "RubyOverhang.RUBY_OVERHANG_ONE_CHAR",
                                        description: "Ruby overhang is the size of one character"
                                    }, {
                                        value: "RubyOverhang.RUBY_OVERHANG_ONE_RUBY",
                                        description: "Ruby overhang is one ruby"
                                    }]
                                }
                            },
                            "RubyParentSpacing": {
                                property: "rubyParentSpacing",
                                type: "RubyParentSpacing",

                                description: "The ruby spacing relative to the parent text. . Can return: RubyParentSpacing enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "RubyParentSpacing.RUBY_PARENT_121_AKI",
                                        description: "Ruby parent 121 aki"
                                    }, {
                                        value: "RubyParentSpacing.RUBY_PARENT_BOTH_SIDES",
                                        description: "Ruby parent both sides"
                                    }, {
                                        value: "RubyParentSpacing.RUBY_PARENT_EQUAL_AKI",
                                        description: "Applies the parent text aki to the ruby characters"
                                    }, {
                                        value: "RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY",
                                        description: "Justifies ruby characters to both edges of the parent text"
                                    }, {
                                        value: "RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT",
                                        description: "Does not base ruby spacing on parent text"
                                    }]
                                }
                            },
                            "RubyTypes": {
                                property: "rubyType",
                                type: "RubyTypes",

                                description: "The ruby type. Can return: RubyTypes enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "RubyTypes.GROUP_RUBY",
                                        description: "Provides ruby for a group of characters"
                                    }, {
                                        value: "RubyTypes.PER_CHARACTER_RUBY",
                                        description: "Provides ruby for each individual character in the group"
                                    }]
                                }
                            },
                            "TextStrokeAlign": {
                                property: "strokeAlignment",
                                type: "TextStrokeAlign",

                                description: "The stroke alignment applied to the text. Can return: TextStrokeAlign enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "TextStrokeAlign.CENTER_ALIGNMENT",
                                        description: "The stroke straddles the path"
                                    }, {
                                        value: "TextStrokeAlign.OUTSIDE_ALIGNMENT",
                                        description: "The stroke is outside the path, like a picture frame"
                                    }]
                                }
                            },
                            "WarichuAlignment": {
                                property: "warichuAlignment",
                                type: "WarichuAlignment",

                                description: "The warichu alignment. Can return: WarichuAlignment enumerator or NothingEnum enumerator.",
                                possibleValues: {
                                    constants: [{
                                        value: "WarichuAlignment.AUTO",
                                        description: "Automatically aligns warichu characters"
                                    }, {
                                        value: "WarichuAlignment.CENTER_ALIGN",
                                        description: "Aligns warichu in the center of the text frame"
                                    }, {
                                        value: "WarichuAlignment.CENTER_JUSTIFIED",
                                        description: "Justifies warichu lines and center aligns the last line"
                                    }, {
                                        value: "WarichuAlignment.FULLY_JUSTIFIED",
                                        description: "Justifies warichu lines and makes all lines of equal length"
                                    }, {
                                        value: "WarichuAlignment.LEFT_ALIGN",
                                        description: "Aligns warichu on the left side of the text frame"
                                    }, {
                                        value: "WarichuAlignment.LEFT_JUSTIFIED",
                                        description: "Justifies warichu lines and left aligns the last line"
                                    }, {
                                        value: "WarichuAlignment.RIGHT_ALIGN",
                                        description: "Warichu on the rigt side of the text frame"
                                    }, {
                                        value: "WarichuAlignment.RIGHT_JUSTIFIED",
                                        description: "Justifies warichu lines and right aligns the last line"
                                    }]
                                }
                            }
                        }
                    },
                    "Capitalization": {
                        property: "capitalization",
                        type: "Capitalization",

                        description: "The capitalization scheme.",
                        possibleValues: {
                            constants: [{
                                value: "Capitalization.ALL_CAPS",
                                description: "Use all uppercase letters"
                            }, {
                                value: "Capitalization.CAP_TO_SMALL_CAP",
                                description: "Use OpenType small caps"
                            }, {
                                value: "Capitalization.NORMAL",
                                description: "Do not change the capitalization of the text"
                            }, {
                                value: "Capitalization.SMALL_CAPS",
                                description: "Use small caps for lowercase letters"
                            }]
                        }
                    },
                    "CharacterAlignment": {
                        property: "characterAlignment",
                        type: "CharacterAlignment",

                        description: "The alignment of small characters to the largest character in the line.",
                        possibleValues: {
                            constants: [{
                                value: "CharacterAlignment.ALIGN_BASELINE",
                                description: "Aligns small characters in a line to the large character"
                            }, {
                                value: "CharacterAlignment.ALIGN_EM_BOTTOM",
                                description: "Aligns small characters in horizontal text to the bottom of the em box of large characters In vertical text, aligns characters to the left of the em box."
                            }, {
                                value: "CharacterAlignment.ALIGN_EM_CENTER",
                                description: "Aligns small characters to the center of the em box of large characters"
                            }, {
                                value: "CharacterAlignment.ALIGN_EM_TOP",
                                description: "Aligns small characters in horizontal text to the top of the em box of large characters In vertical text, aligns characters to the right of the em box."
                            }, {
                                value: "CharacterAlignment.ALIGN_ICF_BOTTOM",
                                description: "Aligns small characters in horizontal text to the bottom of the ICF of large characters In vertical text, aligns characters to the left of the ICF."
                            }, {
                                value: "CharacterAlignment.ALIGN_ICF_TOP",
                                description: "Aligns small characters in horizontal text to the top of the ICF of large characters In vertical text, aligns characters to the right of the ICF."
                            }]
                        }
                    },
                    "CharacterDirectionOptions": {
                        property: "keyboardDirection",
                        type: "CharacterDirectionOptions",

                        description: "The keyboard direction of the character.",
                        possibleValues: {
                            constants: [{
                                value: "CharacterDirectionOptions.DEFAULT_DIRECTION",
                                description: "Default direction"
                            }, {
                                value: "CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION",
                                description: "Left to right direction"
                            }, {
                                value: "CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION",
                                description: "Right to left direction"
                            }]
                        }
                    },
                    "DiacriticPositionOptions": {
                        property: "diacriticPosition",
                        type: "DiacriticPositionOptions",

                        description: "Position of diacriticical characters.",
                        possibleValues: {
                            constants: [{
                                value: "DiacriticPositionOptions.DEFAULT_POSITION",
                                description: "Default position"
                            }, {
                                value: "DiacriticPositionOptions.LOOSE_POSITION",
                                description: "Loose position"
                            }, {
                                value: "DiacriticPositionOptions.MEDIUM_POSITION",
                                description: "Medium position"
                            }, {
                                value: "DiacriticPositionOptions.OPENTYPE_POSITION",
                                description: "OpenType position"
                            }, {
                                value: "DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE",
                                description: "OpenType position from baseline"
                            }, {
                                value: "DiacriticPositionOptions.TIGHT_POSITION",
                                description: "Tight position"
                            }]
                        }
                    },
                    "DigitsTypeOptions": {
                        property: "digitsType",
                        type: "DigitsTypeOptions",

                        description: "The digits type.",
                        possibleValues: {
                            constants: [{
                                value: "DigitsTypeOptions.ARABIC_DIGITS",
                                description: "Arabic digits"
                            }, {
                                value: "DigitsTypeOptions.BENGALI_DIGITS",
                                description: "Bengali digits"
                            }, {
                                value: "DigitsTypeOptions.BURMESE_DIGITS",
                                description: "Burmese digits"
                            }, {
                                value: "DigitsTypeOptions.DEFAULT_DIGITS",
                                description: "Default digits"
                            }, {
                                value: "DigitsTypeOptions.DEVANAGARI_DIGITS",
                                description: "Devanagari digits"
                            }, {
                                value: "DigitsTypeOptions.FARSI_DIGITS",
                                description: "Farsi digits"
                            }, {
                                value: "DigitsTypeOptions.FULL_FARSI_DIGITS",
                                description: "Full Farsi digits"
                            }, {
                                value: "DigitsTypeOptions.GUJARATI_DIGITS",
                                description: "Gujarati digits"
                            }, {
                                value: "DigitsTypeOptions.GURMUKHI_DIGITS",
                                description: "Gurmukhi digits"
                            }, {
                                value: "DigitsTypeOptions.HINDI_DIGITS",
                                description: "Hindi digits"
                            }, {
                                value: "DigitsTypeOptions.KANNADA_DIGITS",
                                description: "Kannada digits"
                            }, {
                                value: "DigitsTypeOptions.KHMER_DIGITS",
                                description: "Khmer digits"
                            }, {
                                value: "DigitsTypeOptions.LAO_DIGITS",
                                description: "Lao digits"
                            }, {
                                value: "DigitsTypeOptions.MALAYALAM_DIGITS",
                                description: "Malayalam digits"
                            }, {
                                value: "DigitsTypeOptions.NATIVE_DIGITS",
                                description: "native digits"
                            }, {
                                value: "DigitsTypeOptions.ORIYA_DIGITS",
                                description: "Oriya digits"
                            }, {
                                value: "DigitsTypeOptions.TAMIL_DIGITS",
                                description: "Tamil digits"
                            }, {
                                value: "DigitsTypeOptions.TELUGU_DIGITS",
                                description: "Telugu digits"
                            }, {
                                value: "DigitsTypeOptions.THAI_DIGITS",
                                description: "Thai digits"
                            }, {
                                value: "DigitsTypeOptions.TIBETAN_DIGITS",
                                description: "Tibetan digits"
                            }]
                        }
                    },
                    "OutlineJoin": {
                        property: "endJoin",
                        type: "OutlineJoin",

                        description: "The stroke join type applied to the characters of the text.",
                        possibleValues: {
                            constants: [{
                                value: "OutlineJoin.BEVEL_END_JOIN",
                                description: "Beveled end join"
                            }, {
                                value: "OutlineJoin.MITER_END_JOIN",
                                description: "Miter end join"
                            }, {
                                value: "OutlineJoin.ROUND_END_JOIN",
                                description: "Rounded end join"
                            }]
                        }
                    },
                    "AlternateGlyphForms": {
                        property: "glyphForm",
                        type: "AlternateGlyphForms",

                        description: "The glyph variant to substitute for standard glyphs.",
                        possibleValues: {
                            constants: [{
                                value: "AlternateGlyphForms.EXPERT_FORM",
                                description: "Uses the expert variant"
                            }, {
                                value: "AlternateGlyphForms.FULL_WIDTH_FORM",
                                description: "Uses the full-width variant"
                            }, {
                                value: "AlternateGlyphForms.JIS04_FORM",
                                description: "Uses the JIS04 variant"
                            }, {
                                value: "AlternateGlyphForms.JIS78_FORM",
                                description: "Uses the JIS78 variant"
                            }, {
                                value: "AlternateGlyphForms.JIS83_FORM",
                                description: "Uses the JIS83 variant"
                            }, {
                                value: "AlternateGlyphForms.JIS90_FORM",
                                description: "Uses the JIS90 variant"
                            }, {
                                value: "AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM",
                                description: "Uses the monospaced half-width variant"
                            }, {
                                value: "AlternateGlyphForms.NLC_FORM",
                                description: "Uses the NLC variant"
                            }, {
                                value: "AlternateGlyphForms.NONE",
                                description: "Does not use an alternate form"
                            }, {
                                value: "AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM",
                                description: "Substitutes proportional glyphs for half-width and full-width glyphs"
                            }, {
                                value: "AlternateGlyphForms.QUARTER_WIDTH_FORM",
                                description: "Uses the quarter-width variant"
                            }, {
                                value: "AlternateGlyphForms.THIRD_WIDTH_FORM",
                                description: "Uses the third-width variant"
                            }, {
                                value: "AlternateGlyphForms.TRADITIONAL_FORM",
                                description: "Uses the traditional variant"
                            }]
                        }
                    },
                    "GridAlignment": {
                        property: "gridAlignment",
                        type: "GridAlignment",

                        description: "The alignment to the frame grid or baseline grid.",
                        possibleValues: {
                            constants: [{
                                value: "GridAlignment.ALIGN_BASELINE",
                                description: "Aligns the text baseline to the grid"
                            }, {
                                value: "GridAlignment.ALIGN_EM_BOTTOM",
                                description: "Aligns the bottom of the em box to the grid"
                            }, {
                                value: "GridAlignment.ALIGN_EM_CENTER",
                                description: "Aligns the center of the em box to the grid"
                            }, {
                                value: "GridAlignment.ALIGN_EM_TOP",
                                description: "Aligns the top of the em box to the grid"
                            }, {
                                value: "GridAlignment.ALIGN_ICF_BOTTOM",
                                description: "Aligns the bottom of the ICF box to the grid"
                            }, {
                                value: "GridAlignment.ALIGN_ICF_TOP",
                                description: "Aligns the top of the ICF box to the grid"
                            }, {
                                value: "GridAlignment.NONE",
                                description: "Lines are not aligned to the grid"
                            }]
                        }
                    },
                    "Justification": {
                        property: "justification",
                        type: "Justification",

                        description: "The paragraph alignment.",
                        possibleValues: {
                            constants: [{
                                value: "Justification.AWAY_FROM_BINDING_SIDE",
                                description: "Aligns text to the side opposite the binding spine of the page"
                            }, {
                                value: "Justification.CENTER_ALIGN",
                                description: "Center aligns the text"
                            }, {
                                value: "Justification.CENTER_JUSTIFIED",
                                description: "Justifies text text and center aligns the last line in the paragraph"
                            }, {
                                value: "Justification.FULLY_JUSTIFIED",
                                description: "Justifies the text, including the last line in the paragraph"
                            }, {
                                value: "Justification.LEFT_ALIGN",
                                description: "Left aligns the text"
                            }, {
                                value: "Justification.LEFT_JUSTIFIED",
                                description: "Justifies the text and left aligns the last line in the paragraph"
                            }, {
                                value: "Justification.RIGHT_ALIGN",
                                description: "Right aligns the text"
                            }, {
                                value: "Justification.RIGHT_JUSTIFIED",
                                description: "Justifies the text and right aligns the last line in the paragraph"
                            }, {
                                value: "Justification.TO_BINDING_SIDE",
                                description: "Aligns text to the binding spine of the page or spread"
                            }]
                        }
                    },
                    "KashidasOptions": {
                        property: "kashidas",
                        type: "KashidasOptions",

                        description: "Use of Kashidas for justification",
                        possibleValues: {
                            constants: [{
                                value: "KashidasOptions.DEFAULT_KASHIDAS",
                                description: "Default kashidas"
                            }, {
                                value: "KashidasOptions.KASHIDAS_OFF",
                                description: "Kashidas off"
                            }]
                        }
                    },
                    "KentenAlignment": {
                        property: "kentenAlignment",
                        type: "KentenAlignment",

                        description: "The alignment of kenten characters relative to the parent characters.",
                        possibleValues: {
                            constants: [{
                                value: "KentenAlignment.ALIGN_KENTEN_CENTER",
                                description: "Aligns kenten with the center of parent charactrers"
                            }, {
                                value: "KentenAlignment.ALIGN_KENTEN_LEFT",
                                description: "Aligns kenten with the left of parent characters"
                            }]
                        }
                    },
                    "KentenCharacterSet": {
                        property: "kentenCharacterSet",
                        type: "KentenCharacterSet",

                        description: "The character set used for the custom kenten character. Note: Valid only when kenten kind is custom.",
                        possibleValues: {
                            constants: [{
                                value: "KentenCharacterSet.CHARACTER_INPUT",
                                description: "Character input"
                            }, {
                                value: "KentenCharacterSet.JIS",
                                description: "JIS"
                            }, {
                                value: "KentenCharacterSet.KUTEN",
                                description: "Kuten"
                            }, {
                                value: "KentenCharacterSet.SHIFT_JIS",
                                description: "Shift JIS"
                            }, {
                                value: "KentenCharacterSet.UNICODE",
                                description: "Unicode"
                            }]
                        }
                    },
                    "KentenCharacter": {
                        property: "kentenKind",
                        type: "KentenCharacter",

                        description: "The style of kenten characters.",
                        possibleValues: {
                            constants: [{
                                value: "KentenCharacter.CUSTOM",
                                description: "Uses a custom kenten style"
                            }, {
                                value: "KentenCharacter.KENTEN_BLACK_CIRCLE",
                                description: "Uses the kenten black circle"
                            }, {
                                value: "KentenCharacter.KENTEN_BLACK_TRIANGLE",
                                description: "Uses the kenten black triangle"
                            }, {
                                value: "KentenCharacter.KENTEN_BULLSEYE",
                                description: "Uses the kenten bullseye"
                            }, {
                                value: "KentenCharacter.KENTEN_FISHEYE",
                                description: "Uses the kenten fisheye"
                            }, {
                                value: "KentenCharacter.KENTEN_SESAME_DOT",
                                description: "Uses the kenten sesame dot"
                            }, {
                                value: "KentenCharacter.KENTEN_SMALL_BLACK_CIRCLE",
                                description: "Uses the kenten small black circle"
                            }, {
                                value: "KentenCharacter.KENTEN_SMALL_WHITE_CIRCLE",
                                description: "Uses the kenten small white circle"
                            }, {
                                value: "KentenCharacter.KENTEN_WHITE_CIRCLE",
                                description: "Uses the kenten white circle"
                            }, {
                                value: "KentenCharacter.KENTEN_WHITE_SESAME_DOT",
                                description: "Uses the kenten white sesame dot"
                            }, {
                                value: "KentenCharacter.KENTEN_WHITE_TRIANGLE",
                                description: "Uses the kenten white triangle"
                            }, {
                                value: "KentenCharacter.NONE",
                                description: "Does not use kenten"
                            }]
                        }
                    },
                    "AdornmentOverprint": {
                        property: "rubyOverprintStroke",
                        type: "AdornmentOverprint",

                        description: "The method of overprinting the ruby stroke.",
                        possibleValues: {
                            constants: [{
                                value: "AdornmentOverprint.AUTO",
                                description: "Uses auto overprint"
                            }, {
                                value: "AdornmentOverprint.OVERPRINT_OFF",
                                description: "Turns off overprint"
                            }, {
                                value: "AdornmentOverprint.OVERPRINT_ON",
                                description: "Turns on overprint"
                            }]
                        }
                    },
                    "RubyKentenPosition": {
                        property: "rubyPosition",
                        type: "RubyKentenPosition",

                        description: "The position of ruby characters relative to the parent text.",
                        possibleValues: {
                            constants: [{
                                value: "RubyKentenPosition.ABOVE_RIGHT",
                                description: "Places kenten or ruby to the right and above the parent character"
                            }, {
                                value: "RubyKentenPosition.BELOW_LEFT",
                                description: "Places kenten or ruby to the left and below the parent character"
                            }]
                        }
                    },
                    "KinsokuHangTypes": {
                        property: "kinsokuHangType",
                        type: "KinsokuHangTypes",

                        description: "The type of hanging punctuation to allow. Note: Valid only when a kinsoku set is in effect.",
                        possibleValues: {
                            constants: [{
                                value: "KinsokuHangTypes.KINSOKU_HANG_FORCE",
                                description: "Enables hanging punctuation but forces hanging punctuation outside the text frame and does not allow the punctuation to be placed on the text frame"
                            }, {
                                value: "KinsokuHangTypes.KINSOKU_HANG_REGULAR",
                                description: "Enables hanging punctuation and allows punctuation marks to be placed on or outside the text frame but allows burasagari characters to hang as little as possible Note: Differs for justified and nonjustified text. For information on justification, see line alignment."
                            }, {
                                value: "KinsokuHangTypes.NONE",
                                description: "Disables hanging punctuation"
                            }]
                        }
                    },
                    "KinsokuSet": {
                        property: "kinsokuSet",
                        type: "KinsokuSet",

                        description: "The kinsoku set that determines legitimate line breaks. Can return: KinsokuTable, KinsokuSet enumerator or String.",
                        possibleValues: {
                            constants: [{
                                value: "KinsokuSet.HARD_KINSOKU",
                                description: "Uses the hard or maximum kinsoku set, which includes all Japanese characters that should not begin or end a line"
                            }, {
                                value: "KinsokuSet.KOREAN_KINSOKU",
                                description: "Uses the Korean kinsoku set"
                            }, {
                                value: "KinsokuSet.NOTHING",
                                description: "Does not use a kinsoku set"
                            }, {
                                value: "KinsokuSet.SIMPLIFIED_CHINESE_KINSOKU",
                                description: "Uses the simplified Chinese kinsoku set"
                            }, {
                                value: "KinsokuSet.SOFT_KINSOKU",
                                description: "Uses the soft or weak kinsoku set, which omits from the hard kinsoku set long vowel symbols and small hiragana and katakana characters"
                            }, {
                                value: "KinsokuSet.TRADITIONAL_CHINESE_KINSOKU",
                                description: "Uses the traditional Chinese kinsoku set"
                            }]
                        }
                    },
                    "KinsokuType": {
                        property: "kinsokuType",
                        type: "KinsokuType",

                        description: "The type of kinsoku processing for preventing kinsoku characters from beginning or ending a line. Note: Valid only when a kinsoku set is defined.",
                        possibleValues: {
                            constants: [{
                                value: "KinsokuType.KINSOKU_PRIORITIZE_ADJUSTMENT_AMOUNT",
                                description: "The kinsoku prioritize adjustment amount"
                            }, {
                                value: "KinsokuType.KINSOKU_PUSH_IN_FIRST",
                                description: "Attempts to move characters to the previous line; if the push-in is not possible, pushes characters to the next line"
                            }, {
                                value: "KinsokuType.KINSOKU_PUSH_OUT_FIRST",
                                description: "Attempts to move characters to the next line; if the push-out is not possible, pushes characters to the previous line"
                            }, {
                                value: "KinsokuType.KINSOKU_PUSH_OUT_ONLY",
                                description: "Always moves characters to the next line Does not attempt a push-in."
                            }]
                        }
                    },
                    "Unit": {
                        property: "sameParaStyleSpacing",
                        type: "Unit",

                        description: "The space between paragraphs using same style. Can return: Unit or Spacing enumerator.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "LeadingModel": {
                        property: "leadingModel",
                        type: "LeadingModel",

                        description: "The point from which leading is measured from line to line.",
                        possibleValues: {
                            constants: [{
                                value: "LeadingModel.LEADING_MODEL_AKI_ABOVE",
                                description: "Measures the space between lines from the aki above"
                            }, {
                                value: "LeadingModel.LEADING_MODEL_AKI_BELOW",
                                description: "Measures the space between lines from the aki below"
                            }, {
                                value: "LeadingModel.LEADING_MODEL_CENTER",
                                description: "Measures the space between the character center points"
                            }, {
                                value: "LeadingModel.LEADING_MODEL_CENTER_DOWN",
                                description: "Center down leading model"
                            }, {
                                value: "LeadingModel.LEADING_MODEL_ROMAN",
                                description: "Measures the space between type baselines"
                            }]
                        }
                    },
                    "MojikumiTable": {
                        property: "mojikumi",
                        type: "MojikumiTable",

                        description: "The mojikumi table. For information, see mojikumi table defaults. Can return: MojikumiTable, String or MojikumiTableDefaults enumerator.",
                        possibleValues: {
                            "MojikumiTableDefaults": {
                                property: "basedOnMojikumiSet",
                                type: "MojikumiTableDefaults",

                                description: "The existing mojikumi set on which to base the new mojikumi set.",
                                possibleValues: {
                                    constants: [{
                                        value: "MojikumiTableDefaults.LINE_END_ALL_ONE_EM_ENUM",
                                        description: "Uses full-width spacing for all characters"
                                    }, {
                                        value: "MojikumiTableDefaults.LINE_END_ALL_ONE_HALF_EM_ENUM",
                                        description: "Uses half-width spacing for all characters"
                                    }, {
                                        value: "MojikumiTableDefaults.LINE_END_PERIOD_ONE_EM_ENUM",
                                        description: "Uses full-width spacing for punctuation"
                                    }, {
                                        value: "MojikumiTableDefaults.LINE_END_UKE_NO_FLOAT_ENUM",
                                        description: "Uses line end uke no float"
                                    }, {
                                        value: "MojikumiTableDefaults.NOTHING",
                                        description: "Turns off mojikumi"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_ALL_NO_FLOAT_ENUM",
                                        description: "Indents lines one full space and uses no float for all characters"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_ALL_ONE_EM_ENUM",
                                        description: "Indents lines one full space and uses full-width spacing for all characters"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_ALL_ONE_HALF_EM_ENUM",
                                        description: "Indents lines one full space and uses half-width spacing for all characters"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_PERIOD_ONE_EM_ENUM",
                                        description: "Indents lines one full space and uses full-width spacing for punctuation and for the last character in the line"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_UKE_NO_FLOAT_ENUM",
                                        description: "Indents lines one full space and uses line end uke no float"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_EM_INDENT_LINE_END_UKE_ONE_HALF_EM_ENUM",
                                        description: "Indents lines one space and uses line end uke one half space"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_OR_ONE_HALF_EM_INDENT_LINE_END_ALL_ONE_EM_ENUM",
                                        description: "Uses full-witdh spacing for all characters except the last character in the line, which uses either full- or half-width spacing"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_OR_ONE_HALF_EM_INDENT_LINE_END_PERIOD_ONE_EM_ENUM",
                                        description: "Indents lines one or one-half space and uses full-width spacing for punctuation and for the last character in the line"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_OR_ONE_HALF_EM_INDENT_LINE_END_UKE_NO_FLOAT_ENUM",
                                        description: "Indents lines one half space or one full space and uses line end uke no float"
                                    }, {
                                        value: "MojikumiTableDefaults.ONE_OR_ONE_HALF_EM_INDENT_LINE_END_UKE_ONE_HALF_EM_ENUM",
                                        description: "Indents lines one full or half space and uses line end uke one half space"
                                    }, {
                                        value: "MojikumiTableDefaults.SIMP_CHINESE_DEFAULT",
                                        description: "Uses mojikumi tsume and aki optimized for Simplified Chinese punctuation glyphs"
                                    }, {
                                        value: "MojikumiTableDefaults.TRAD_CHINESE_DEFAULT",
                                        description: "Uses mojikumi tsume and aki optimized for Traditional Chinese centered punctuation glyphs"
                                    }]
                                }
                            }
                        }
                    },
                    "NumberingStyle": {
                        property: "numberingFormat",
                        type: "NumberingStyle",

                        description: "Numbering format options. Can return: NumberingStyle enumerator or String.",
                        possibleValues: {
                            constants: [{
                                value: "NumberingStyle.ARABIC",
                                description: "Arabic"
                            }, {
                                value: "NumberingStyle.ARABIC_ABJAD",
                                description: "Uses Arabic Abjad"
                            }, {
                                value: "NumberingStyle.ARABIC_ALIF_BA_TAH",
                                description: "Uses Arabic Alif Ba Tah"
                            }, {
                                value: "NumberingStyle.DOUBLE_LEADING_ZEROS",
                                description: "Add double leading zeros"
                            }, {
                                value: "NumberingStyle.FORMAT_NONE",
                                description: "Do not add characters"
                            }, {
                                value: "NumberingStyle.HEBREW_BIBLICAL",
                                description: "Uses Hebrew Biblical"
                            }, {
                                value: "NumberingStyle.HEBREW_NON_STANDARD",
                                description: "Uses Hebrew Non Standard"
                            }, {
                                value: "NumberingStyle.KANJI",
                                description: "Kanji"
                            }, {
                                value: "NumberingStyle.KATAKANA_MODERN",
                                description: "Katakana (a, i, u, e, o..)."
                            }, {
                                value: "NumberingStyle.KATAKANA_TRADITIONAL",
                                description: "Katakana (i, ro, ha, ni..)."
                            }, {
                                value: "NumberingStyle.LOWER_LETTERS",
                                description: "Lower letters"
                            }, {
                                value: "NumberingStyle.LOWER_ROMAN",
                                description: "Lower roman"
                            }, {
                                value: "NumberingStyle.SINGLE_LEADING_ZEROS",
                                description: "Add single leading zeros"
                            }, {
                                value: "NumberingStyle.TRIPLE_LEADING_ZEROS",
                                description: "Add triple leading zeros"
                            }, {
                                value: "NumberingStyle.UPPER_LETTERS",
                                description: "Upper letters"
                            }, {
                                value: "NumberingStyle.UPPER_ROMAN",
                                description: "Upper roman"
                            }]
                        }
                    },
                    "OTFFigureStyle": {
                        property: "otfFigureStyle",
                        type: "OTFFigureStyle",

                        description: "The figure style in OpenType fonts.",
                        possibleValues: {
                            constants: [{
                                value: "OTFFigureStyle.DEFAULT_VALUE",
                                description: "Use the default figure style for the font"
                            }, {
                                value: "OTFFigureStyle.PROPORTIONAL_LINING",
                                description: "Use proportional width lining figures"
                            }, {
                                value: "OTFFigureStyle.PROPORTIONAL_OLDSTYLE",
                                description: "Use proportional width oldstyle figures"
                            }, {
                                value: "OTFFigureStyle.TABULAR_LINING",
                                description: "Use monspaced lining figures"
                            }, {
                                value: "OTFFigureStyle.TABULAR_OLDSTYLE",
                                description: "Use monospaced oldstyle figures"
                            }]
                        }
                    },
                    "CornerOptions": {
                        property: "paragraphShadingTopRightCornerOption",
                        type: "CornerOptions",

                        description: "The shape to apply to the top right corner of rectangular shapes",
                        possibleValues: {
                            constants: [{
                                value: "CornerOptions.BEVEL_CORNER",
                                description: "Beveled corner option"
                            }, {
                                value: "CornerOptions.FANCY_CORNER",
                                description: "Fancy corner option"
                            }, {
                                value: "CornerOptions.INSET_CORNER",
                                description: "Inset corner option"
                            }, {
                                value: "CornerOptions.INVERSE_ROUNDED_CORNER",
                                description: "Inverted rounded corner option"
                            }, {
                                value: "CornerOptions.NONE",
                                description: "No corner option"
                            }, {
                                value: "CornerOptions.ROUNDED_CORNER",
                                description: "Rounded corner option"
                            }]
                        }
                    },
                    "ParagraphBorderBottomOriginEnum": {
                        property: "paragraphBorderBottomOrigin",
                        type: "ParagraphBorderBottomOriginEnum",

                        description: "The basis (descent or baseline) used to calculate the bottom origin of the paragraph border.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphBorderBottomOriginEnum.BASELINE_BOTTOM_ORIGIN",
                                description: "Makes the paragraph border bottom origin based on baseline of the text in the paragraph"
                            }, {
                                value: "ParagraphBorderBottomOriginEnum.DESCENT_BOTTOM_ORIGIN",
                                description: "Makes the paragraph border bottom origin based on descent of the text in the paragraph"
                            }]
                        }
                    },
                    "EndCap": {
                        property: "paragraphBorderStrokeEndCap",
                        type: "EndCap",

                        description: "The end shape of an open path.",
                        possibleValues: {
                            constants: [{
                                value: "EndCap.BUTT_END_CAP",
                                description: "A squared end that stops at the path's endpoint"
                            }, {
                                value: "EndCap.PROJECTING_END_CAP",
                                description: "A squared end that extends beyond the endpoint by half the stroke-width"
                            }, {
                                value: "EndCap.ROUND_END_CAP",
                                description: "A semicircular end that extends beyond the endpoint by half the stroke-width"
                            }]
                        }
                    },
                    "EndJoin": {
                        property: "paragraphBorderStrokeEndJoin",
                        type: "EndJoin",

                        description: "The corner join applied to the ParagraphStyle.",
                        possibleValues: {
                            constants: [{
                                value: "EndJoin.BEVEL_END_JOIN",
                                description: "Beveled end join"
                            }, {
                                value: "EndJoin.MITER_END_JOIN",
                                description: "Miter end join"
                            }, {
                                value: "EndJoin.ROUND_END_JOIN",
                                description: "Rounded end join"
                            }]
                        }
                    },
                    "ParagraphBorderTopOriginEnum": {
                        property: "paragraphBorderTopOrigin",
                        type: "ParagraphBorderTopOriginEnum",

                        description: "The basis (cap height, ascent or baseline) used to calculate the top origin of the paragraph border.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphBorderTopOriginEnum.ASCENT_TOP_ORIGIN",
                                description: "Makes the paragraph border top origin based on ascent of the text in the paragraph"
                            }, {
                                value: "ParagraphBorderTopOriginEnum.BASELINE_TOP_ORIGIN",
                                description: "Makes the paragraph border top origin based on baseline of the text in the paragraph"
                            }, {
                                value: "ParagraphBorderTopOriginEnum.LEADING_TOP_ORIGIN",
                                description: "Makes the paragraph border top origin based on leading of the text in the paragraph"
                            }]
                        }
                    },
                    "ParagraphBorderEnum": {
                        property: "paragraphBorderWidth",
                        type: "ParagraphBorderEnum",

                        description: "The basis (text width or column width) used to calculate the width of the paragraph border.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphBorderEnum.COLUMN_WIDTH",
                                description: "Makes the paragraph border based on width of the column"
                            }, {
                                value: "ParagraphBorderEnum.TEXT_WIDTH",
                                description: "Makes the paragraph border based on width of lines of text in the paragraph"
                            }]
                        }
                    },
                    "ParagraphDirectionOptions": {
                        property: "paragraphDirection",
                        type: "ParagraphDirectionOptions",

                        description: "Paragraph direction.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION",
                                description: "Left to Right paragraph direction"
                            }, {
                                value: "ParagraphDirectionOptions.RIGHT_TO_LEFT_DIRECTION",
                                description: "Right to Left paragraph direction"
                            }]
                        }
                    },
                    "ParagraphJustificationOptions": {
                        property: "paragraphJustification",
                        type: "ParagraphJustificationOptions",

                        description: "Paragraph justification.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphJustificationOptions.ARABIC_JUSTIFICATION",
                                description: "Arabic justification"
                            }, {
                                value: "ParagraphJustificationOptions.DEFAULT_JUSTIFICATION",
                                description: "Default justification"
                            }, {
                                value: "ParagraphJustificationOptions.NASKH_JUSTIFICATION",
                                description: "Naskh justification"
                            }, {
                                value: "ParagraphJustificationOptions.NASKH_KASHIDA_JUSTIFICATION",
                                description: "Kashidas Use naskh justification if you want to also use Justifcation Alternates."
                            }, {
                                value: "ParagraphJustificationOptions.NASKH_KASHIDA_JUSTIFICATION_FRAC",
                                description: "Fractional Kashidas Use naskh justification if you want to also use Justifcation Alternates."
                            }, {
                                value: "ParagraphJustificationOptions.NASKH_TATWEEL_JUSTIFICATION",
                                description: "Kashidas without Stretched Connections"
                            }, {
                                value: "ParagraphJustificationOptions.NASKH_TATWEEL_JUSTIFICATION_FRAC",
                                description: "Fractional Kashidas without Stretched Connections"
                            }]
                        }
                    },
                    "ParagraphShadingBottomOriginEnum": {
                        property: "paragraphShadingBottomOrigin",
                        type: "ParagraphShadingBottomOriginEnum",

                        description: "The basis (descent or baseline) used to calculate the bottom origin of the paragraph shading.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphShadingBottomOriginEnum.BASELINE_BOTTOM_ORIGIN",
                                description: "Makes the paragraph shading bottom origin based on baseline of the text in the paragraph"
                            }, {
                                value: "ParagraphShadingBottomOriginEnum.DESCENT_BOTTOM_ORIGIN",
                                description: "Makes the paragraph shading bottom origin based on descent of the text in the paragraph"
                            }]
                        }
                    },
                    "ParagraphShadingTopOriginEnum": {
                        property: "paragraphShadingTopOrigin",
                        type: "ParagraphShadingTopOriginEnum",

                        description: "The basis (cap height, ascent or baseline) used to calculate the top origin of the paragraph shading.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphShadingTopOriginEnum.ASCENT_TOP_ORIGIN",
                                description: "Makes the paragraph shading top origin based on ascent of the text in the paragraph"
                            }, {
                                value: "ParagraphShadingTopOriginEnum.BASELINE_TOP_ORIGIN",
                                description: "Makes the paragraph shading top origin based on baseline of the text in the paragraph"
                            }, {
                                value: "ParagraphShadingTopOriginEnum.LEADING_TOP_ORIGIN",
                                description: "Makes the paragraph shading top origin based on leading of the text in the paragraph"
                            }]
                        }
                    },
                    "ParagraphShadingWidthEnum": {
                        property: "paragraphShadingWidth",
                        type: "ParagraphShadingWidthEnum",

                        description: "The basis (text width or column width) used to calculate the width of the paragraph shading.",
                        possibleValues: {
                            constants: [{
                                value: "ParagraphShadingWidthEnum.COLUMN_WIDTH",
                                description: "Makes the paragraph shading based on width of the column"
                            }, {
                                value: "ParagraphShadingWidthEnum.TEXT_WIDTH",
                                description: "Makes the paragraph shading based on width of lines of text in the paragraph"
                            }]
                        }
                    },
                    "Position": {
                        property: "position",
                        type: "Position",

                        description: "The text position relative to the baseline.",
                        possibleValues: {
                            constants: [{
                                value: "Position.NORMAL",
                                description: "Normal position"
                            }, {
                                value: "Position.OT_DENOMINATOR",
                                description: "For OpenType fonts, shrinks the text but keeps text on the main text baseline Note: Valid only for numeric characters."
                            }, {
                                value: "Position.OT_NUMERATOR",
                                description: "For OpenType fonts, shrinks the text but keeps the top of the characters aligned with the top of the main text Note: Valid only for numeric characters."
                            }, {
                                value: "Position.OT_SUBSCRIPT",
                                description: "For OpenType fonts, uses--if available--lowered glyphs that are sized correctly relative to the surrounding characters"
                            }, {
                                value: "Position.OT_SUPERSCRIPT",
                                description: "For OpenType fonts, uses--if available--raised glyphs that are sized correctly relative to the surrounding characters"
                            }, {
                                value: "Position.SUBSCRIPT",
                                description: "Subscripts the text"
                            }, {
                                value: "Position.SUPERSCRIPT",
                                description: "Superscripts the text"
                            }]
                        }
                    },
                    "PositionalForms": {
                        property: "positionalForm",
                        type: "PositionalForms",

                        description: "The OpenType positional form.",
                        possibleValues: {
                            constants: [{
                                value: "PositionalForms.CALCULATE",
                                description: "Calculated forms"
                            }, {
                                value: "PositionalForms.FINAL",
                                description: "Final form"
                            }, {
                                value: "PositionalForms.INITIAL",
                                description: "Initial form"
                            }, {
                                value: "PositionalForms.ISOLATED",
                                description: "Isolated form"
                            }, {
                                value: "PositionalForms.MEDIAL",
                                description: "Medial form"
                            }, {
                                value: "PositionalForms.NONE",
                                description: "None"
                            }]
                        }
                    },
                    "Color": {
                        property: "previewColor",
                        type: "Color",

                        description: "The color to use for preview, specified either as an array of three doubles, each in the range 0 to 255 and representing R, G, and B values, or as a UI color. Can return: Array of 3 Reals (0 - 255) or UIColors enumerator or NothingEnum enumerator.",
                        possibleValues: {
                            arrayLength: 3,
                            "from": 0,
                            "to": 255
                        }
                    },
                    "HyphenationStyleEnum": {
                        property: "providerHyphenationStyle",
                        type: "HyphenationStyleEnum",

                        description: "The hyphenation style chosen for the provider.",
                        possibleValues: {
                            constants: [{
                                value: "HyphenationStyleEnum.HYPH_AESTHETIC",
                                description: "Hyphenates at aesthetic hyphenation points"
                            }, {
                                value: "HyphenationStyleEnum.HYPH_ALL",
                                description: "Hyphenates at all possible hyphenation points"
                            }, {
                                value: "HyphenationStyleEnum.HYPH_ALL_BUT_UNAESTHETIC",
                                description: "Hyphenates at all but unaesthetic hyphenation points"
                            }, {
                                value: "HyphenationStyleEnum.HYPH_PREFERRED_AESTHETIC",
                                description: "Hyphenates at preferred aesthetic hyphenation points"
                            }]
                        }
                    },
                    "RubyAlignments": {
                        property: "rubyAlignment",
                        type: "RubyAlignments",

                        description: "The ruby alignment.",
                        possibleValues: {
                            constants: [{
                                value: "RubyAlignments.RUBY_1_AKI",
                                description: "Ruby 1 aki"
                            }, {
                                value: "RubyAlignments.RUBY_CENTER",
                                description: "Centers ruby relative to the parent text"
                            }, {
                                value: "RubyAlignments.RUBY_EQUAL_AKI",
                                description: "Ruby equal aki"
                            }, {
                                value: "RubyAlignments.RUBY_FULL_JUSTIFY",
                                description: "Justifies ruby across the parent text"
                            }, {
                                value: "RubyAlignments.RUBY_JIS",
                                description: "Ruby JIS"
                            }, {
                                value: "RubyAlignments.RUBY_LEFT",
                                description: "Aligns ruby with the left-most character in the parent text"
                            }, {
                                value: "RubyAlignments.RUBY_RIGHT",
                                description: "Aligns ruby with the right-most character in the parent text"
                            }]
                        }
                    },
                    "RubyOverhang": {
                        property: "rubyParentOverhangAmount",
                        type: "RubyOverhang",

                        description: "The amount by which ruby characters can overhang the parent text.",
                        possibleValues: {
                            constants: [{
                                value: "RubyOverhang.NONE",
                                description: "Does not allow ruby overhang"
                            }, {
                                value: "RubyOverhang.RUBY_OVERHANG_HALF_CHAR",
                                description: "Ruby is overhang one-half the size of one chararacter"
                            }, {
                                value: "RubyOverhang.RUBY_OVERHANG_HALF_RUBY",
                                description: "Ruby overhang is one-half ruby"
                            }, {
                                value: "RubyOverhang.RUBY_OVERHANG_NO_LIMIT",
                                description: "There is no ruby overhang size limit"
                            }, {
                                value: "RubyOverhang.RUBY_OVERHANG_ONE_CHAR",
                                description: "Ruby overhang is the size of one character"
                            }, {
                                value: "RubyOverhang.RUBY_OVERHANG_ONE_RUBY",
                                description: "Ruby overhang is one ruby"
                            }]
                        }
                    },
                    "RubyParentSpacing": {
                        property: "rubyParentSpacing",
                        type: "RubyParentSpacing",

                        description: "The ruby spacing relative to the parent text.",
                        possibleValues: {
                            constants: [{
                                value: "RubyParentSpacing.RUBY_PARENT_121_AKI",
                                description: "Ruby parent 121 aki"
                            }, {
                                value: "RubyParentSpacing.RUBY_PARENT_BOTH_SIDES",
                                description: "Ruby parent both sides"
                            }, {
                                value: "RubyParentSpacing.RUBY_PARENT_EQUAL_AKI",
                                description: "Applies the parent text aki to the ruby characters"
                            }, {
                                value: "RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY",
                                description: "Justifies ruby characters to both edges of the parent text"
                            }, {
                                value: "RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT",
                                description: "Does not base ruby spacing on parent text"
                            }]
                        }
                    },
                    "RubyTypes": {
                        property: "rubyType",
                        type: "RubyTypes",

                        description: "The ruby type.",
                        possibleValues: {
                            constants: [{
                                value: "RubyTypes.GROUP_RUBY",
                                description: "Provides ruby for a group of characters"
                            }, {
                                value: "RubyTypes.PER_CHARACTER_RUBY",
                                description: "Provides ruby for each individual character in the group"
                            }]
                        }
                    },
                    "RuleWidth": {
                        property: "ruleBelowWidth",
                        type: "RuleWidth",

                        description: "The basis (text width or column width) used to calculate the width of the paragraph rule below.",
                        possibleValues: {
                            constants: [{
                                value: "RuleWidth.COLUMN_WIDTH",
                                description: "Makes the rule the width of the column"
                            }, {
                                value: "RuleWidth.TEXT_WIDTH",
                                description: "Makes the paragraph rule above the width of the first line of text in the paragraph"
                            }]
                        }
                    },
                    "SingleWordJustification": {
                        property: "singleWordJustification",
                        type: "SingleWordJustification",

                        description: "The alignment to use for lines that contain a single word.",
                        possibleValues: {
                            constants: [{
                                value: "SingleWordJustification.CENTER_ALIGN",
                                description: "Center aligns the word"
                            }, {
                                value: "SingleWordJustification.FULLY_JUSTIFIED",
                                description: "Fully justifies the word"
                            }, {
                                value: "SingleWordJustification.LEFT_ALIGN",
                                description: "Left aligns the word"
                            }, {
                                value: "SingleWordJustification.RIGHT_ALIGN",
                                description: "Right aligns the word"
                            }]
                        }
                    },
                    "SpanColumnTypeOptions": {
                        property: "spanColumnType",
                        type: "SpanColumnTypeOptions",

                        description: "Whether a paragraph should be a single column, span columns or split columns",
                        possibleValues: {
                            constants: [{
                                value: "SpanColumnTypeOptions.SINGLE_COLUMN",
                                description: "Paragraph is a single column"
                            }, {
                                value: "SpanColumnTypeOptions.SPAN_COLUMNS",
                                description: "Paragraph spans the columns"
                            }, {
                                value: "SpanColumnTypeOptions.SPLIT_COLUMNS",
                                description: "Paragraph splits the columns"
                            }]
                        }
                    },
                    "ShortInteger(1-40)": {
                        property: "spanSplitColumnCount",
                        type: "ShortInteger(1-40)",

                        description: "The number of columns a paragraph spans or the number of split columns. Can return: Short Integer (1 - 40) or SpanColumnCountOptions enumerator.",
                        possibleValues: {
                            "from": 1,
                            "to": 40
                        }
                    },
                    "StartParagraph": {
                        property: "startParagraph",
                        type: "StartParagraph",

                        description: "The location at which to start the paragraph.",
                        possibleValues: {
                            constants: [{
                                value: "StartParagraph.ANYWHERE",
                                description: "Starts in the next available space"
                            }, {
                                value: "StartParagraph.NEXT_COLUMN",
                                description: "Starts at the top of the next column"
                            }, {
                                value: "StartParagraph.NEXT_EVEN_PAGE",
                                description: "Starts at the top of the next even-numbered page"
                            }, {
                                value: "StartParagraph.NEXT_FRAME",
                                description: "Starts at the top of the next text frame in the thread"
                            }, {
                                value: "StartParagraph.NEXT_ODD_PAGE",
                                description: "Starts at the top of the next odd-numbered page"
                            }, {
                                value: "StartParagraph.NEXT_PAGE",
                                description: "Starts at the top of the next page"
                            }]
                        }
                    },
                    "TextStrokeAlign": {
                        property: "strokeAlignment",
                        type: "TextStrokeAlign",

                        description: "The stroke alignment applied to the text.",
                        possibleValues: {
                            constants: [{
                                value: "TextStrokeAlign.CENTER_ALIGNMENT",
                                description: "The stroke straddles the path"
                            }, {
                                value: "TextStrokeAlign.OUTSIDE_ALIGNMENT",
                                description: "The stroke is outside the path, like a picture frame"
                            }]
                        }
                    },
                    "WarichuAlignment": {
                        property: "warichuAlignment",
                        type: "WarichuAlignment",

                        description: "The warichu alignment.",
                        possibleValues: {
                            constants: [{
                                value: "WarichuAlignment.AUTO",
                                description: "Automatically aligns warichu characters"
                            }, {
                                value: "WarichuAlignment.CENTER_ALIGN",
                                description: "Aligns warichu in the center of the text frame"
                            }, {
                                value: "WarichuAlignment.CENTER_JUSTIFIED",
                                description: "Justifies warichu lines and center aligns the last line"
                            }, {
                                value: "WarichuAlignment.FULLY_JUSTIFIED",
                                description: "Justifies warichu lines and makes all lines of equal length"
                            }, {
                                value: "WarichuAlignment.LEFT_ALIGN",
                                description: "Aligns warichu on the left side of the text frame"
                            }, {
                                value: "WarichuAlignment.LEFT_JUSTIFIED",
                                description: "Justifies warichu lines and left aligns the last line"
                            }, {
                                value: "WarichuAlignment.RIGHT_ALIGN",
                                description: "Warichu on the rigt side of the text frame"
                            }, {
                                value: "WarichuAlignment.RIGHT_JUSTIFIED",
                                description: "Justifies warichu lines and right aligns the last line"
                            }]
                        }
                    }
                }
            },
            "Boolean": {
                property: "overprintStroke",
                type: "Boolean",

                description: "If true, the ObjectStyle's stroke color overprints any underlying objects. If false, the stroke color knocks out the underlying colors.",
                possibleValues: {
                    constants: [{
                        value: true
                    }, {
                        value: false
                    }]
                }
            },
            "ArrowHeadAlignmentEnum": {
                property: "arrowHeadAlignment",
                type: "ArrowHeadAlignmentEnum",

                description: "The arrowhead alignment applied to the ObjectStyle.",
                possibleValues: {
                    constants: [{
                        value: "ArrowHeadAlignmentEnum.INSIDE_PATH",
                        description: "The arrowhead is inside the path, path geometry changes to accomodate arrow heads"
                    }, {
                        value: "ArrowHeadAlignmentEnum.OUTSIDE_PATH",
                        description: "The arrowhead is outside the path ie. path geometry remains same."
                    }]
                }
            },
            "BaselineFrameGridOption": {
                property: "baselineFrameGridOptions",
                type: "BaselineFrameGridOption",

                description: "Baseline frame grid option settings.",
                possibleValues: {
                    "Color": {
                        property: "baselineFrameGridColor",
                        type: "Color",

                        description: "The grid line color, specified either as an array of three doubles, each in the range 0 to 255 and representing R, G, and B values, or as a UI color. Can return: Array of 3 Reals (0 - 255) or UIColors enumerator.",
                        possibleValues: {
                            arrayLength: 3,
                            "from": 0,
                            "to": 255
                        }
                    },
                    "Number": {
                        property: "startingOffsetForBaselineFrameGrid",
                        type: "Number",

                        description: "The amount to offset the baseline grid.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "BaselineFrameGridRelativeOption": {
                        property: "baselineFrameGridRelativeOption",
                        type: "BaselineFrameGridRelativeOption",

                        description: "The location (top of page, top margin, top of frame, or frame inset) on which to base the custom baseline grid.",
                        possibleValues: {
                            constants: [{
                                value: "BaselineFrameGridRelativeOption.TOP_OF_FRAME",
                                description: "Offsets the grid from the top of the text frame"
                            }, {
                                value: "BaselineFrameGridRelativeOption.TOP_OF_INSET",
                                description: "Offsets the grid from the top inset of the text frame"
                            }, {
                                value: "BaselineFrameGridRelativeOption.TOP_OF_MARGIN",
                                description: "Offsets the grid from the top margin of the page"
                            }, {
                                value: "BaselineFrameGridRelativeOption.TOP_OF_PAGE",
                                description: "Offsets the grid from the top of the page"
                            }]
                        }
                    },
                    "Boolean": {
                        property: "useCustomBaselineFrameGrid",
                        type: "Boolean",

                        description: "If true, uses a custom baseline frame grid.",
                        possibleValues: {
                            constants: [{
                                value: true
                            }, {
                                value: false
                            }]
                        }
                    }
                }
            },
            "CornerOptions": {
                property: "topRightCornerOption",
                type: "CornerOptions",

                description: "The shape to apply to the top right corner of rectangular shapes",
                possibleValues: {
                    constants: [{
                        value: "CornerOptions.BEVEL_CORNER",
                        description: "Beveled corner option"
                    }, {
                        value: "CornerOptions.FANCY_CORNER",
                        description: "Fancy corner option"
                    }, {
                        value: "CornerOptions.INSET_CORNER",
                        description: "Inset corner option"
                    }, {
                        value: "CornerOptions.INVERSE_ROUNDED_CORNER",
                        description: "Inverted rounded corner option"
                    }, {
                        value: "CornerOptions.NONE",
                        description: "No corner option"
                    }, {
                        value: "CornerOptions.ROUNDED_CORNER",
                        description: "Rounded corner option"
                    }]
                }
            },
            "Number": {
                property: "topRightCornerRadius",
                type: "Number",

                description: "The radius in measurement units of the corner effect applied to the top right corner of rectangular shapes",
                possibleValues: {
                    "from": "Number.MAX_SAFE_INTEGER",
                    "to": "Number.MIN_SAFE_INTEGER"
                }
            },
            "EndCap": {
                property: "endCap",
                type: "EndCap",

                description: "The end shape of an open path.",
                possibleValues: {
                    constants: [{
                        value: "EndCap.BUTT_END_CAP",
                        description: "A squared end that stops at the path's endpoint"
                    }, {
                        value: "EndCap.PROJECTING_END_CAP",
                        description: "A squared end that extends beyond the endpoint by half the stroke-width"
                    }, {
                        value: "EndCap.ROUND_END_CAP",
                        description: "A semicircular end that extends beyond the endpoint by half the stroke-width"
                    }]
                }
            },
            "EndJoin": {
                property: "endJoin",
                type: "EndJoin",

                description: "The corner join applied to the ObjectStyle.",
                possibleValues: {
                    constants: [{
                        value: "EndJoin.BEVEL_END_JOIN",
                        description: "Beveled end join"
                    }, {
                        value: "EndJoin.MITER_END_JOIN",
                        description: "Miter end join"
                    }, {
                        value: "EndJoin.ROUND_END_JOIN",
                        description: "Rounded end join"
                    }]
                }
            },
            "Number Range": {
                property: "strokeTint",
                type: "Number Range",

                description: "The percent of tint to use in object's stroke color. (To specify a tint percent, use a number in the range of 0 to 100; to use the inherited or overridden value, use -1.)",
                possibleValues: {
                    "from": 0,
                    "to": 100
                }
            },
            "FrameFittingOption": {
                property: "frameFittingOptions",
                type: "FrameFittingOption",

                description: "The frame fitting option to apply to placed or pasted content. Can be applied to a frame, object style, or document or to the application.",
                possibleValues: {
                    "Boolean": {
                        property: "autoFit",
                        type: "Boolean",

                        description: "If true, the last saved fitting options will be applied to the contents of a frame when it is resized.",
                        possibleValues: {
                            constants: [{
                                value: true
                            }, {
                                value: false
                            }]
                        }
                    },
                    "Number": {
                        property: "topCrop",
                        type: "Number",

                        description: "The amount in measurement units to crop the top edge of a graphic.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "AnchorPoint": {
                        property: "fittingAlignment",
                        type: "AnchorPoint",

                        description: "The point with which to align the image empty when fitting in a frame. For information, see frame fitting options.",
                        possibleValues: {
                            constants: [{
                                value: "AnchorPoint.BOTTOM_CENTER_ANCHOR",
                                description: "The center point on the bottom of the bounding box"
                            }, {
                                value: "AnchorPoint.BOTTOM_LEFT_ANCHOR",
                                description: "The bottom left corner"
                            }, {
                                value: "AnchorPoint.BOTTOM_RIGHT_ANCHOR",
                                description: "The bottom right corner"
                            }, {
                                value: "AnchorPoint.CENTER_ANCHOR",
                                description: "The center point in the bounding box"
                            }, {
                                value: "AnchorPoint.LEFT_CENTER_ANCHOR",
                                description: "The center point on the left side of the bounding box"
                            }, {
                                value: "AnchorPoint.RIGHT_CENTER_ANCHOR",
                                description: "The center point on the right side of the bounding box"
                            }, {
                                value: "AnchorPoint.TOP_CENTER_ANCHOR",
                                description: "The center point on the top of the bounding box"
                            }, {
                                value: "AnchorPoint.TOP_LEFT_ANCHOR",
                                description: "The top left corner"
                            }, {
                                value: "AnchorPoint.TOP_RIGHT_ANCHOR",
                                description: "The top right corner"
                            }]
                        }
                    },
                    "EmptyFrameFittingOptions": {
                        property: "fittingOnEmptyFrame",
                        type: "EmptyFrameFittingOptions",

                        description: "The frame fitting option to apply to placed or pasted content if the frame is empty. Can be applied to a frame, object style, or document or to the application.",
                        possibleValues: {
                            constants: [{
                                value: "EmptyFrameFittingOptions.CONTENT_TO_FRAME",
                                description: "Resizes content to fit the frame Note: Content that has different proportions than the frame appears stretched or squeezed."
                            }, {
                                value: "EmptyFrameFittingOptions.FILL_PROPORTIONALLY",
                                description: "Resizes content to fill the frame while perserving the content's proportions If the content and frame have different proportions, some of the content is obscured by the frame."
                            }, {
                                value: "EmptyFrameFittingOptions.NONE",
                                description: "Does not use a fitting option"
                            }, {
                                value: "EmptyFrameFittingOptions.PROPORTIONALLY",
                                description: "Resizes content to fit the frame while preserving content proportions If the content and frame have different proportions, some empty space appears in the frame."
                            }]
                        }
                    }
                }
            },
            "ArrowHead": {
                property: "rightLineEnd",
                type: "ArrowHead",

                description: "The arrowhead applied to the end of the path.",
                possibleValues: {
                    constants: [{
                        value: "ArrowHead.BARBED_ARROW_HEAD",
                        description: "A solid arrow head whose pierced end bows sharply toward the point and whose point describes a 45-degree angle"
                    }, {
                        value: "ArrowHead.BAR_ARROW_HEAD",
                        description: "A vertical bar bisected by the stroke, which meets the stroke at a right angle and is the same weight as the stroke The bar's length is 4.5 times the stroke width."
                    }, {
                        value: "ArrowHead.CIRCLE_ARROW_HEAD",
                        description: "A hollow circle whose outline is the same weight as the stroke The circle's diameter is 5 times the stroke width."
                    }, {
                        value: "ArrowHead.CIRCLE_SOLID_ARROW_HEAD",
                        description: "A solid circle whose diameter is 5 times the stroke width"
                    }, {
                        value: "ArrowHead.CURVED_ARROW_HEAD",
                        description: "A solid arrow head whose pierced end concaves toward the point and whose point describes a 45-degree angle"
                    }, {
                        value: "ArrowHead.NONE",
                        description: "None"
                    }, {
                        value: "ArrowHead.SIMPLE_ARROW_HEAD",
                        description: "An arrow head formed by two slanting lines whose intersection forms a 45-degree angle and whose stroke weight is the same as the path's stroke"
                    }, {
                        value: "ArrowHead.SIMPLE_WIDE_ARROW_HEAD",
                        description: "An arrow head formed by two slanting lines whose intersection forms a 90-degree angle and whose stroke weight is the same as the path's stroke"
                    }, {
                        value: "ArrowHead.SQUARE_ARROW_HEAD",
                        description: "A hollow square set perpendicular to the path, whose outline is the same weight as the stroke The length of one side of the square is 5 times the stroke width."
                    }, {
                        value: "ArrowHead.SQUARE_SOLID_ARROW_HEAD",
                        description: "A solid square set perpendicular to the end of the path The length of one side of the square is 5 times the stroke width."
                    }, {
                        value: "ArrowHead.TRIANGLE_ARROW_HEAD",
                        description: "A solid triangle arrow head whose point describes a 45-degree angle"
                    }, {
                        value: "ArrowHead.TRIANGLE_WIDE_ARROW_HEAD",
                        description: "A solid triangle arrow head whose point describes a 90-degree angle"
                    }]
                }
            },
            "StoryPreference": {
                property: "storyPreferences",
                type: "StoryPreference",

                description: "Story preference settings.",
                possibleValues: {
                    "Boolean": {
                        property: "opticalMarginAlignment",
                        type: "Boolean",

                        description: "If true, adjust the position of characters at the edges of the frame to provide a better appearance.",
                        possibleValues: {
                            constants: [{
                                value: true
                            }, {
                                value: false
                            }]
                        }
                    },
                    "Number": {
                        property: "opticalMarginSize",
                        type: "Number",

                        description: "The point size used as the basis for calculating optical margin alignment. (Range: 0.1 to 1296)",
                        possibleValues: {
                            "from": 1,
                            "to": 1296
                        }
                    },
                    "StoryDirectionOptions": {
                        property: "storyDirection",
                        type: "StoryDirectionOptions",

                        description: "The direction of the story.",
                        possibleValues: {
                            constants: [{
                                value: "StoryDirectionOptions.LEFT_TO_RIGHT_DIRECTION",
                                description: "Left to right direction"
                            }, {
                                value: "StoryDirectionOptions.RIGHT_TO_LEFT_DIRECTION",
                                description: "Right to left direction"
                            }, {
                                value: "StoryDirectionOptions.UNKNOWN_DIRECTION",
                                description: "Unknown direction"
                            }]
                        }
                    }
                }
            },
            "StrokeAlignment": {
                property: "strokeAlignment",
                type: "StrokeAlignment",

                description: "The stroke alignment applied to the ObjectStyle.",
                possibleValues: {
                    constants: [{
                        value: "StrokeAlignment.CENTER_ALIGNMENT",
                        description: "The stroke straddles the path"
                    }, {
                        value: "StrokeAlignment.INSIDE_ALIGNMENT",
                        description: "The stroke is inside the path"
                    }, {
                        value: "StrokeAlignment.OUTSIDE_ALIGNMENT",
                        description: "The stroke is outside the path, like a picture frame"
                    }]
                }
            },
            "TextFramePreference": {
                property: "textFramePreferences",
                type: "TextFramePreference",

                description: "Text frame preference settings.",
                possibleValues: {
                    "AutoSizingReferenceEnum": {
                        property: "autoSizingReferencePoint",
                        type: "AutoSizingReferenceEnum",

                        description: "The reference point for auto sizing of text frame. Reference point is automatically adjusted to the suitable value depending on the auto-sizing type value. As an example, top left reference point becomes top center for height only dimension",
                        possibleValues: {
                            constants: [{
                                value: "AutoSizingReferenceEnum.BOTTOM_CENTER_POINT",
                                description: "Center point on the botom edge of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.BOTTOM_LEFT_POINT",
                                description: "Bottom left point of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.BOTTOM_RIGHT_POINT",
                                description: "Bottom right point of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.CENTER_POINT",
                                description: "Center point of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.LEFT_CENTER_POINT",
                                description: "Center point on the left edge of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.RIGHT_CENTER_POINT",
                                description: "Center point on the right edge of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.TOP_CENTER_POINT",
                                description: "Center point on the top edge of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.TOP_LEFT_POINT",
                                description: "Top left point of bounding box"
                            }, {
                                value: "AutoSizingReferenceEnum.TOP_RIGHT_POINT",
                                description: "Top right point of bounding box"
                            }]
                        }
                    },
                    "AutoSizingTypeEnum": {
                        property: "autoSizingType",
                        type: "AutoSizingTypeEnum",

                        description: "Auto-sizing type of text frame. Based on type, reference value is automatically adjusted. For example, for height only type, top-left reference point becomes top-center. Recommended to change auto-sizing type, after setting other auto-sizing attributes",
                        possibleValues: {
                            constants: [{
                                value: "AutoSizingTypeEnum.HEIGHT_AND_WIDTH",
                                description: "Text frame will be resized in both(height and width) dimensions"
                            }, {
                                value: "AutoSizingTypeEnum.HEIGHT_AND_WIDTH_PROPORTIONALLY",
                                description: "Text frame will be resized in both(height and width) dimensions proportionally"
                            }, {
                                value: "AutoSizingTypeEnum.HEIGHT_ONLY",
                                description: "Text frame will be resized in height dimension only"
                            }, {
                                value: "AutoSizingTypeEnum.OFF",
                                description: "Text frame auto-sizing is off"
                            }, {
                                value: "AutoSizingTypeEnum.WIDTH_ONLY",
                                description: "Text frame will be resized in width dimension only"
                            }]
                        }
                    },
                    "Number Range": {
                        property: "textColumnCount",
                        type: "Number Range",

                        description: "The number of columns in the text frame. Note: Depending on the value of use fixed column width, the number of columns can change automatically when the text frame size changes.",
                        possibleValues: {
                            "from": 1,
                            "to": 40
                        }
                    },
                    "Boolean": {
                        property: "verticalBalanceColumns",
                        type: "Boolean",

                        description: "Vertically justify balanced across all columns.",
                        possibleValues: {
                            constants: [{
                                value: true
                            }, {
                                value: false
                            }]
                        }
                    },
                    "FirstBaseline": {
                        property: "firstBaselineOffset",
                        type: "FirstBaseline",

                        description: "The distance between the baseline of the text and the top inset of the text frame or cell.",
                        possibleValues: {
                            constants: [{
                                value: "FirstBaseline.ASCENT_OFFSET",
                                description: "The tallest character in the font falls below the top inset of the object"
                            }, {
                                value: "FirstBaseline.CAP_HEIGHT",
                                description: "The tops of upper case letters touch the top inset of the object"
                            }, {
                                value: "FirstBaseline.EMBOX_HEIGHT",
                                description: "The text em box height is the distance between the baseline of the text and the top inset of the object"
                            }, {
                                value: "FirstBaseline.FIXED_HEIGHT",
                                description: "Uses the value specified for minimum first baseline offset as the distance between the baseline of the text and the top inset of the object"
                            }, {
                                value: "FirstBaseline.LEADING_OFFSET",
                                description: "The text leading value defines the distance between the baseline of the text and the top inset of the object"
                            }, {
                                value: "FirstBaseline.X_HEIGHT",
                                description: "The tops of lower case letters touch the top inset of the object"
                            }]
                        }
                    },
                    "Number": {
                        property: "verticalThreshold",
                        type: "Number",

                        description: "The maximum amount of vertical space between two paragraphs. Note: Valid only when vertical justification is justified; the specified amount is applied in addition to the space before or space after values defined for the paragraph.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "Unit(0-8640points)": {
                        property: "insetSpacing",
                        type: "Unit(0-8640points)",

                        description: "The amount to offset text from the edges of the text frame, specified either as a single value applied uniformly to all sides of the text frame or as an array of 4 values in the format [top inset, left inset, bottom inset, right inset]. Can return: Unit (0 - 8640 points) or Array of 4 Units (0 - 8640 points).",
                        possibleValues: {
                            "from": 0,
                            "to": 8640
                        }
                    },
                    "VerticalJustification": {
                        property: "verticalJustification",
                        type: "VerticalJustification",

                        description: "The vertical alignment of the text content.",
                        possibleValues: {
                            constants: [{
                                value: "VerticalJustification.BOTTOM_ALIGN",
                                description: "Text is aligned at the bottom of the object"
                            }, {
                                value: "VerticalJustification.CENTER_ALIGN",
                                description: "Text is center aligned vertically in the object"
                            }, {
                                value: "VerticalJustification.JUSTIFY_ALIGN",
                                description: "Lines of text are evenly distributed vertically between the top and bottom of the object"
                            }, {
                                value: "VerticalJustification.TOP_ALIGN",
                                description: "Text is aligned at the top of the object"
                            }]
                        }
                    }
                }
            },
            "TextWrapPreference": {
                property: "textWrapPreferences",
                type: "TextWrapPreference",

                description: "The text wrap preference properties that define the default formatting for wrapping text around objects.",
                possibleValues: {
                    "Boolean": {
                        property: "inverse",
                        type: "Boolean",

                        description: "If true, inverts the text wrap.",
                        possibleValues: {
                            constants: [{
                                value: true
                            }, {
                                value: false
                            }]
                        }
                    },
                    "TextWrapModes": {
                        property: "textWrapMode",
                        type: "TextWrapModes",

                        description: "The text wrap mode.",
                        possibleValues: {
                            constants: [{
                                value: "TextWrapModes.BOUNDING_BOX_TEXT_WRAP",
                                description: "Wraps text around the object's bounding box"
                            }, {
                                value: "TextWrapModes.CONTOUR",
                                description: "Wraps text around the object following the specified contour options"
                            }, {
                                value: "TextWrapModes.JUMP_OBJECT_TEXT_WRAP",
                                description: "Forces text to jump above or below the object, so that no text appears on the object's right or left"
                            }, {
                                value: "TextWrapModes.NEXT_COLUMN_TEXT_WRAP",
                                description: "Forces text to jump to the next available column"
                            }, {
                                value: "TextWrapModes.NONE",
                                description: "No text wrap"
                            }]
                        }
                    },
                    "Unit": {
                        property: "textWrapOffset",
                        type: "Unit",

                        description: "The minimum space between text and the edges of the wrapped object. The format for defining text wrap offset values depends on the text wrap type. If text wrap type is jump object text wrap, specify 2 values in the format [top, bottom]. If text wrap type is next column text wrap or contour, specify a single value. For bounding box text wrap, specify 4 values in the format in the format [top, left, bottom, right]. . Can return: Unit, Array of Units or NothingEnum enumerator.",
                        possibleValues: {
                            arrayLength: 2
                        }
                    },
                    "TextWrapSideOptions": {
                        property: "textWrapSide",
                        type: "TextWrapSideOptions",

                        description: "Text wrap side options.",
                        possibleValues: {
                            constants: [{
                                value: "TextWrapSideOptions.BOTH_SIDES",
                                description: "Both sides text wrap"
                            }, {
                                value: "TextWrapSideOptions.LARGEST_AREA",
                                description: "Largest side text wrap"
                            }, {
                                value: "TextWrapSideOptions.LEFT_SIDE",
                                description: "Left side text wrap"
                            }, {
                                value: "TextWrapSideOptions.RIGHT_SIDE",
                                description: "Right side text wrap"
                            }, {
                                value: "TextWrapSideOptions.SIDE_AWAY_FROM_SPINE",
                                description: "Away from binding side text wrap"
                            }, {
                                value: "TextWrapSideOptions.SIDE_TOWARDS_SPINE",
                                description: "Binding side text wrap"
                            }]
                        }
                    }
                }
            },
            "TransformAttributeOption": {
                property: "transformAttributeOptions",
                type: "TransformAttributeOption",

                description: "The layout attribute options to apply to any page item.",
                possibleValues: {
                    "Number": {
                        property: "transformAttrY",
                        type: "Number",

                        description: "The top position of the object, defined by the object style.",
                        possibleValues: {
                            "from": "Number.MAX_SAFE_INTEGER",
                            "to": "Number.MIN_SAFE_INTEGER"
                        }
                    },
                    "TransformPositionReference": {
                        property: "transformAttrTopReference",
                        type: "TransformPositionReference",

                        description: "The reference point to be used while setting the Y attribute of object style.",
                        possibleValues: {
                            constants: [{
                                value: "TransformPositionReference.PAGE_EDGE_REFERENCE",
                                description: "Corresponding edge of the page Left edge for X attribute, Top edge for Y attribute."
                            }, {
                                value: "TransformPositionReference.PAGE_MARGIN_REFERENCE",
                                description: "Corresponding page margin of the page Left margin for X attribute, Top margin for Y attribute."
                            }]
                        }
                    },
                    "AnchorPoint": {
                        property: "transformAttrRefAnchorPoint",
                        type: "AnchorPoint",

                        description: "Option to specify the achor point to be used by the style for anchoring the object while applying the position.",
                        possibleValues: {
                            constants: [{
                                value: "AnchorPoint.BOTTOM_CENTER_ANCHOR",
                                description: "The center point on the bottom of the bounding box"
                            }, {
                                value: "AnchorPoint.BOTTOM_LEFT_ANCHOR",
                                description: "The bottom left corner"
                            }, {
                                value: "AnchorPoint.BOTTOM_RIGHT_ANCHOR",
                                description: "The bottom right corner"
                            }, {
                                value: "AnchorPoint.CENTER_ANCHOR",
                                description: "The center point in the bounding box"
                            }, {
                                value: "AnchorPoint.LEFT_CENTER_ANCHOR",
                                description: "The center point on the left side of the bounding box"
                            }, {
                                value: "AnchorPoint.RIGHT_CENTER_ANCHOR",
                                description: "The center point on the right side of the bounding box"
                            }, {
                                value: "AnchorPoint.TOP_CENTER_ANCHOR",
                                description: "The center point on the top of the bounding box"
                            }, {
                                value: "AnchorPoint.TOP_LEFT_ANCHOR",
                                description: "The top left corner"
                            }, {
                                value: "AnchorPoint.TOP_RIGHT_ANCHOR",
                                description: "The top right corner"
                            }]
                        }
                    }
                }
            }
        }
    },
    "ArrowHeadAlignmentEnum": {
        property: "arrowHeadAlignment",
        type: "ArrowHeadAlignmentEnum",

        description: "The arrowhead alignment applied to the PageItem.",
        possibleValues: {
            constants: [{
                value: "ArrowHeadAlignmentEnum.INSIDE_PATH",
                description: "The arrowhead is inside the path, path geometry changes to accomodate arrow heads"
            }, {
                value: "ArrowHeadAlignmentEnum.OUTSIDE_PATH",
                description: "The arrowhead is outside the path ie. path geometry remains same."
            }]
        }
    },
    "CornerOptions": {
        property: "topRightCornerOption",
        type: "CornerOptions",

        description: "The shape to apply to the top right corner of rectangular shapes",
        possibleValues: {
            constants: [{
                value: "CornerOptions.BEVEL_CORNER",
                description: "Beveled corner option"
            }, {
                value: "CornerOptions.FANCY_CORNER",
                description: "Fancy corner option"
            }, {
                value: "CornerOptions.INSET_CORNER",
                description: "Inset corner option"
            }, {
                value: "CornerOptions.INVERSE_ROUNDED_CORNER",
                description: "Inverted rounded corner option"
            }, {
                value: "CornerOptions.NONE",
                description: "No corner option"
            }, {
                value: "CornerOptions.ROUNDED_CORNER",
                description: "Rounded corner option"
            }]
        }
    },
    "EndCap": {
        property: "endCap",
        type: "EndCap",

        description: "The end shape of an open path.",
        possibleValues: {
            constants: [{
                value: "EndCap.BUTT_END_CAP",
                description: "A squared end that stops at the path's endpoint"
            }, {
                value: "EndCap.PROJECTING_END_CAP",
                description: "A squared end that extends beyond the endpoint by half the stroke-width"
            }, {
                value: "EndCap.ROUND_END_CAP",
                description: "A semicircular end that extends beyond the endpoint by half the stroke-width"
            }]
        }
    },
    "EndJoin": {
        property: "endJoin",
        type: "EndJoin",

        description: "The corner join applied to the PageItem.",
        possibleValues: {
            constants: [{
                value: "EndJoin.BEVEL_END_JOIN",
                description: "Beveled end join"
            }, {
                value: "EndJoin.MITER_END_JOIN",
                description: "Miter end join"
            }, {
                value: "EndJoin.ROUND_END_JOIN",
                description: "Rounded end join"
            }]
        }
    },
    "Number Range": {
        property: "strokeTint",
        type: "Number Range",

        description: "The percent of tint to use in object's stroke color. (To specify a tint percent, use a number in the range of 0 to 100; to use the inherited or overridden value, use -1.)",
        possibleValues: {
            "from": 0,
            "to": 100
        }
    },
    "DimensionsConstraints": {
        property: "verticalLayoutConstraints",
        type: "DimensionsConstraints",

        description: "The top margin, height, and bottom margin constraints this item is subject to when using the object-based layout rule.",
        possibleValues: {
            constants: [{
                value: "DimensionsConstraints.FIXED_DIMENSION",
                description: "The dimension remains fixed relative to the parent"
            }, {
                value: "DimensionsConstraints.FLEXIBLE_DIMENSION",
                description: "The dimension can vary relative to the parent"
            }]
        }
    },
    "Layer": {
        property: "itemLayer",
        type: "Layer",

        description: "The layer that the PageItem is on.",
        possibleValues: {
            "Boolean": {
                property: "visible",
                type: "Boolean",

                description: "If true, the Layer is visible.",
                possibleValues: {
                    constants: [{
                        value: true
                    }, {
                        value: false
                    }]
                }
            },
            "Color": {
                property: "layerColor",
                type: "Color",

                description: "The color of the layer, specified either as an array of three doubles, each in the range 0 to 255 and representing R, G, and B values, or as a UI color. Can return: Array of 3 Reals (0 - 255) or UIColors enumerator.",
                possibleValues: {
                    arrayLength: 3,
                    "from": 0,
                    "to": 255
                }
            }
        }
    },
    "ArrowHead": {
        property: "rightLineEnd",
        type: "ArrowHead",

        description: "The arrowhead applied to the end of the path.",
        possibleValues: {
            constants: [{
                value: "ArrowHead.BARBED_ARROW_HEAD",
                description: "A solid arrow head whose pierced end bows sharply toward the point and whose point describes a 45-degree angle"
            }, {
                value: "ArrowHead.BAR_ARROW_HEAD",
                description: "A vertical bar bisected by the stroke, which meets the stroke at a right angle and is the same weight as the stroke The bar's length is 4.5 times the stroke width."
            }, {
                value: "ArrowHead.CIRCLE_ARROW_HEAD",
                description: "A hollow circle whose outline is the same weight as the stroke The circle's diameter is 5 times the stroke width."
            }, {
                value: "ArrowHead.CIRCLE_SOLID_ARROW_HEAD",
                description: "A solid circle whose diameter is 5 times the stroke width"
            }, {
                value: "ArrowHead.CURVED_ARROW_HEAD",
                description: "A solid arrow head whose pierced end concaves toward the point and whose point describes a 45-degree angle"
            }, {
                value: "ArrowHead.NONE",
                description: "None"
            }, {
                value: "ArrowHead.SIMPLE_ARROW_HEAD",
                description: "An arrow head formed by two slanting lines whose intersection forms a 45-degree angle and whose stroke weight is the same as the path's stroke"
            }, {
                value: "ArrowHead.SIMPLE_WIDE_ARROW_HEAD",
                description: "An arrow head formed by two slanting lines whose intersection forms a 90-degree angle and whose stroke weight is the same as the path's stroke"
            }, {
                value: "ArrowHead.SQUARE_ARROW_HEAD",
                description: "A hollow square set perpendicular to the path, whose outline is the same weight as the stroke The length of one side of the square is 5 times the stroke width."
            }, {
                value: "ArrowHead.SQUARE_SOLID_ARROW_HEAD",
                description: "A solid square set perpendicular to the end of the path The length of one side of the square is 5 times the stroke width."
            }, {
                value: "ArrowHead.TRIANGLE_ARROW_HEAD",
                description: "A solid triangle arrow head whose point describes a 45-degree angle"
            }, {
                value: "ArrowHead.TRIANGLE_WIDE_ARROW_HEAD",
                description: "A solid triangle arrow head whose point describes a 90-degree angle"
            }]
        }
    },
    "DisplaySettingOptions": {
        property: "localDisplaySetting",
        type: "DisplaySettingOptions",

        description: "Display performance options for the PageItem.",
        possibleValues: {
            constants: [{
                value: "DisplaySettingOptions.DEFAULT_VALUE",
                description: "Uses the container object's default display performance preferences setting For information, see default display settings."
            }, {
                value: "DisplaySettingOptions.HIGH_QUALITY",
                description: "Slower performance; displays high-resolution graphics and high-quality transparencies and turns on anti-aliasing"
            }, {
                value: "DisplaySettingOptions.OPTIMIZED",
                description: "Best performance; grays out graphics and turns off transparency and anti-aliasing"
            }, {
                value: "DisplaySettingOptions.TYPICAL",
                description: "Moderate performance speed; displays proxy graphics and low-quality transparencies and turns on anti-aliasing"
            }]
        }
    },
    "StrokeAlignment": {
        property: "strokeAlignment",
        type: "StrokeAlignment",

        description: "The stroke alignment applied to the PageItem.",
        possibleValues: {
            constants: [{
                value: "StrokeAlignment.CENTER_ALIGNMENT",
                description: "The stroke straddles the path"
            }, {
                value: "StrokeAlignment.INSIDE_ALIGNMENT",
                description: "The stroke is inside the path"
            }, {
                value: "StrokeAlignment.OUTSIDE_ALIGNMENT",
                description: "The stroke is outside the path, like a picture frame"
            }]
        }
    },
    "StrokeCornerAdjustment": {
        property: "strokeCornerAdjustment",
        type: "StrokeCornerAdjustment",

        description: "The corner adjustment applied to the PageItem.",
        possibleValues: {
            constants: [{
                value: "StrokeCornerAdjustment.DASHES",
                description: "Changes the length of dashes so that dashes always occur at path ends and corners; maintains set gap length Note: Can cause dashes to be different lengths on shapes whose sides are of different lengths, such as rectangles."
            }, {
                value: "StrokeCornerAdjustment.DASHES_AND_GAPS",
                description: "Adjusts both dashes and gaps to cover corners and end points Note: Causes dash and gap sizes to be consistent on all sides of the shape."
            }, {
                value: "StrokeCornerAdjustment.GAPS",
                description: "Changes the length of gaps so that dashes or dots always occur at ends and corners; maintains dash length or dot diameter Note: Can cause gaps to be different lengths on shapes whose sides are of different lengths, such as rectangles."
            }, {
                value: "StrokeCornerAdjustment.NONE",
                description: "No adjustment"
            }]
        }
    }
}