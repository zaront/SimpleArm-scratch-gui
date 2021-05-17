/*
  simplearmExtension.js - adds custom scratch block to control SimpleArm.
  Created by Zaron Thompson, June 28, 2017.
*/

const ArgumentType = require("scratch-vm/src/extension-support/argument-type");
const BlockType = require("scratch-vm/src/extension-support/block-type");
const Color = require("scratch-vm/src/util/color");
const Runtime = require("scratch-vm/src/engine/runtime");

const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzguOTY0IiBoZWlnaHQ9IjM5LjQ5NSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTAuMzA5IDEwLjQ1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGcgdHJhbnNmb3JtPSJtYXRyaXgoLjM4MDM0IDAgMCAuMzg1NTIgLTU2LjA4NyAtOTYuNTk4KSI+CiAgPGNpcmNsZSBjeD0iMTYxLjAyIiBjeT0iMjY0LjEyIiByPSIxMy4yMDIiIGZpbGw9IiNmY2U5ZGIiIHN0cm9rZT0iIzAxMDAwMyIgc3Ryb2tlLXdpZHRoPSIuNyIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3LjY5NCAyNC45MDUpIj4KICAgPGcgc3Ryb2tlLXdpZHRoPSIwIj4KICAgIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KC4yNjQ1OCAwIDAgLjI2NDU4IDIxLjYyNSA0MC44NTYpIiBkPSJtNDgwLjM3IDc0OS45My0wLjEwMTU2IDAuMjUxOTVhOC41MDE5IDguNTAxOSAwIDAgMSAwLjU2NjQxIDMuMDUwOCA4LjUwMTkgOC41MDE5IDAgMCAxLTQuOTIxOSA3LjcwMTJsLTAuMjIyNjUgMC41NTA3OCA1LjMwNDcgMi4xNDg0IDQuNjc5Ny0xMS41NTV6Ii8+CiAgICA8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguMjY0NTggMCAwIC4yNjQ1OCAyMS42MjUgNDAuODU2KSIgZD0ibTQ2Ny44NCA3MzIuNDRhMTEuMTY2IDExLjE2NiAwIDAgMS04LjgwNjYgNC4zMjIzIDExLjE2NiAxMS4xNjYgMCAwIDEtMi41MjczLTAuMzAyNzNsNy40Njg4IDE1LjIwM2E4LjUwMTkgOC41MDE5IDAgMCAxIDguMzQ5Ni02LjkzMTYgOC41MDE5IDguNTAxOSAwIDAgMSAxLjYzNDggMC4xNjIxMXoiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KC4yNjQ1OCAwIDAgLjI2NDU4IDIxLjYyNSA0MC44NTYpIiBkPSJtNDQ4LjU0IDcyOS4zNy0xNi45MDggMzQuNDE2IDEyLjg2OSA2LjMyNDIgMTYuNDY5LTMzLjUyMWExMS4xNjYgMTEuMTY2IDAgMCAxLTEuOTMzNiAwLjE2OTkyIDExLjE2NiAxMS4xNjYgMCAwIDEtMTAuNDk2LTcuMzg4N3oiLz4KICAgPC9nPgogICA8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguMjY0NTggMCAwIC4yNjQ1OCAyMS42MjUgNDAuODU2KSIgZD0ibTQ1OS4wNCA3MTcuNzNhNy44NTcxIDcuODU3MSAwIDAgMC03Ljg1NzQgNy44NTc0IDcuODU3MSA3Ljg1NzEgMCAwIDAgNy44NTc0IDcuODU3NCA3Ljg1NzEgNy44NTcxIDAgMCAwIDcuODU3NC03Ljg1NzQgNy44NTcxIDcuODU3MSAwIDAgMC03Ljg1NzQtNy44NTc0em0wIDQuNjg1NWEzLjE3MTggMy4xNzE4IDAgMCAxIDMuMTcxOSAzLjE3MTkgMy4xNzE4IDMuMTcxOCAwIDAgMS0zLjE3MTkgMy4xNzE5IDMuMTcxOCAzLjE3MTggMCAwIDEtMy4xNzE5LTMuMTcxOSAzLjE3MTggMy4xNzE4IDAgMCAxIDMuMTcxOS0zLjE3MTl6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjc1NTkxIi8+CiAgIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KC4yNjQ1OCAwIDAgLjI2NDU4IDIxLjYyNSA0MC44NTYpIiBkPSJtNDcyLjMzIDc0Ni45NmE2LjI3MzMgNi4yNzMzIDAgMCAwLTYuMjcxNSA2LjI3MzQgNi4yNzMzIDYuMjczMyAwIDAgMCA2LjI3MTUgNi4yNzM0IDYuMjczMyA2LjI3MzMgMCAwIDAgNi4yNzM0LTYuMjczNCA2LjI3MzMgNi4yNzMzIDAgMCAwLTYuMjczNC02LjI3MzR6bTAgMy43NDIyYTIuNTMyNCAyLjUzMjQgMCAwIDEgMi41MzMyIDIuNTMxMiAyLjUzMjQgMi41MzI0IDAgMCAxLTIuNTMzMiAyLjUzMzIgMi41MzI0IDIuNTMyNCAwIDAgMS0yLjUzMTItMi41MzMyIDIuNTMyNCAyLjUzMjQgMCAwIDEgMi41MzEyLTIuNTMxMnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIuNjAzNTMiLz4KICAgPGcgc3Ryb2tlLXdpZHRoPSIwIj4KICAgIDxyZWN0IHg9IjEzMy43NSIgeT0iMjQyLjk1IiB3aWR0aD0iNi42MTQ2IiBoZWlnaHQ9IjIuNTUxMyIvPgogICAgPHJlY3QgdHJhbnNmb3JtPSJtYXRyaXgoLjQ4MDEzIC0uODc3MiAuOTM3MjkgLjM0ODU0IDAgMCkiIHg9Ii0xNzUiIHk9IjI0OC42NSIgd2lkdGg9IjEuOTM2MiIgaGVpZ2h0PSIuOTA3MjkiIHJ5PSIwIi8+CiAgICA8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguMjY0NTggMCAwIC4yNjQ1OCAyMS42MjUgNDAuODU2KSIgZD0ibTQ5OC42NCA3NDQuMzUtMTMuNTc0IDIuNTYyNSAwLjM3NSA0LjA5OTYgMi4xNDI2LTAuNDA0MyA4LjExNTItMi43MjQ2IDAuMzc1IDEuMTE5MSAyLjk0MTQtMC41NTQ2OXoiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KC4yNjQ1OCAwIDAgLjI2NDU4IDIxLjYyNSA0MC44NTYpIiBkPSJtNDgzLjE4IDc1Ny45LTMuOTI5NyAwLjMxODM2IDIuMzA4NiAxNC45NjkgMy45MzE2LTAuMzE4MzYtMC41NDQ5Mi0zLjUyOTNoLTEuNTE5NXYtOS44NDU3eiIvPgogICA8L2c+CiAgPC9nPgogPC9nPgo8L3N2Zz4K";
const apiUrl = "http://localhost:8080/simplearm/api/";
const noRecordings = ["<NONE>"];
const simplearmKey = "simplearm";
const simplearmKeyPrefix = simplearmKey + "_";

class SimpleArmBlocks {
    constructor(runtime) {
        this._runtime = runtime;
        this._isButtonPressed = false;
        this._isKnobTurned = false;
        this._listeningForEvents = false;
        this._knobPosition = 0;
        this._isLongButton = false;
        this._buttonPressCount = 0;
        this._shoulderPos = 0;
        this._upperArmPos = 0;
        this._forearmPos = 0;
        this._handPos = 0;
        this._gripperPos = 0;
        this._xPos = 0;
        this._yPos = 0;
        this._zPos = 0;
        this._isPositionChanged = false;
        this._isSpeaking = false;
        this._lastHeard = "";
        this._lastHeardChanged = false;
        this._isListening = false;
        this._isConnected = false;
        this._recordingList = noRecordings;
        this._prevBlocks = {};
        this._blockInCodingArea = false;
        this._addedBlock;
        this._blocksRefreshing;

        //connect to event
        this._runtime.on(Runtime.PROJECT_CHANGED, () => {
            //skip if in the middle of a refresh
            if (this._blocksRefreshing)
                return;

            const oldBlocks = this._prevBlocks;
            const newBlockContainer = this._runtime._editingTarget.blocks;
            const runtime = this._runtime;
            const newBlocks = newBlockContainer._blocks;
            const oldKeys = Object.keys(oldBlocks);
            const newKeys = Object.keys(newBlocks);

            //was the added block placed in the coding area?
            if (oldKeys.length === newKeys.length && this._blockInCodingArea && this._addedBlock)
            {
                this._blockInCodingArea = false;
                const block = this._addedBlock;
                this._addedBlock = undefined;

                //is it a simplearm block?
                if (block.opcode.startsWith(simplearmKeyPrefix)) {
                    //are all parameters default values?
                    const templateParams = runtime._blockInfo.find(i => i.id === simplearmKey).blocks.find(i => i.json.type === block.opcode).info.arguments;
                    const params = Object.keys(block.inputs);
                    for (const param of params) {
                        if (this.getParameterValue(newBlockContainer, block, param) != templateParams[param].defaultValue) 
                            return;
                    }
                    
                    //set the parameters to match the robots current values
                    setTimeout(() => this.autoSetParameters(block),50);
                }
            }

            //was a single block added?
            if (oldKeys.length + 1 === newKeys.length) {
                const newKey = newKeys.filter(i => !oldKeys.includes(i));
                if (newKey && newKey.length === 1) {
                    const newBlock = newBlocks[newKey[0]];

                    if (!newBlock.shadow) {
                        if (newBlock.parent || !newBlock.topLevel) {
                            this._addedBlock = undefined;
                        } else {
                            this._addedBlock = newBlock; //track the added block
                        }
                    }
                }
            }

            //take a snapshot of its blocks
            this._prevBlocks = {...newBlocks};
        });
        this._runtime.on(Runtime.TOOLBOX_EXTENSIONS_NEED_UPDATE,() => {
            //take a snapshot of its blocks
            this._prevBlocks = {...this._runtime._editingTarget.blocks._blocks};
        });

        this._runtime.on(Runtime.BLOCK_DRAG_END,() => {
            //the next Project Changed event IS NOT creating a new block
            this._blockInCodingArea = false;
        });

        this._runtime.on(Runtime.BLOCK_DRAG_UPDATE,(outsideWorkspace) => {
            //the next Project Changed event may be creating a new block
            this._blockInCodingArea = !outsideWorkspace;
        });

        //start listening to robot arm
        this.listenForEvents();
    }

    getInfo() {
        return {
            id: simplearmKey,
            name: "SimpleArm",
            docsURI: "https://simplearm.com",
            blockIconURI: blockIconURI,
            color1: "#8e8e8e",
            color2: "#797979",
            color3: "#494949",
            blocks: [
                {
                    opcode: "playback",
                    blockType: BlockType.COMMAND,
                    text: "playback [Recording]",
                    arguments: {
                        Recording: {
                            type: ArgumentType.STRING,
                            menu: "recordingList",
                        },
                    },
                },
                {
                    opcode: "playbackFrom",
                    blockType: BlockType.COMMAND,
                    text:
                        "playback [Recording] from [StartDescription] to [EndDescription]",
                    arguments: {
                        Recording: {
                            type: ArgumentType.STRING,
                            menu: "recordingList",
                        },
                        StartDescription: {
                            type: ArgumentType.STRING,
                            defaultValue: "pick 1",
                        },
                        EndDescription: {
                            type: ArgumentType.STRING,
                            defaultValue: "safety",
                        },
                    },
                },
                {
                    opcode: "servoMoveTarget",
                    blockType: BlockType.COMMAND,
                    text: "move to x:[X] y:[Y] z:[Z]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15,
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                        },
                    },
                },
                {
                    opcode: "servoMoveAll",
                    blockType: BlockType.COMMAND,
                    text:
                        "move shoulder:[Servo1Pos] upper arm:[Servo2Pos] forearm:[Servo3Pos] hand:[Servo4Pos] gripper:[Servo5Pos]",
                    arguments: {
                        Servo1Pos: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                        Servo2Pos: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                        Servo3Pos: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                        Servo4Pos: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                        Servo5Pos: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "servoMove",
                    blockType: BlockType.COMMAND,
                    text: "move [ServoID] to position [Position]",
                    arguments: {
                        ServoID: {
                            type: ArgumentType.STRING,
                            menu: "servoList",
                            defaultValue: "gripper",
                        },
                        Position: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "moveSettings",
                    blockType: BlockType.COMMAND,
                    text:
                        "move settings speed:[Speed] ease in:[EaseIn] ease out:[EaseOut] [Sync]",
                    arguments: {
                        Speed: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                        },
                        EaseIn: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        EaseOut: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Sync: {
                            type: ArgumentType.STRING,
                            defaultValue: "unsynchronized",
                            menu: "syncronizedList",
                        },
                    },
                },
                {
                    opcode: "moveWait",
                    blockType: BlockType.COMMAND,
                    text: "wait until done moving",
                },
                {
                    opcode: "isMoving",
                    blockType: BlockType.BOOLEAN,
                    text: "is moving",
                },
                {
                    opcode: "servoPosition",
                    blockType: BlockType.COMMAND,
                    text: "position [ServoID] at [Position]",
                    arguments: {
                        ServoID: {
                            type: ArgumentType.STRING,
                            menu: "servoList",
                            defaultValue: "gripper",
                        },
                        Position: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "servosStop",
                    blockType: BlockType.COMMAND,
                    text: "stop moving",
                },
                {
                    opcode: "servosOff",
                    blockType: BlockType.COMMAND,
                    text: "servos off",
                },
                {
                    opcode: "servoOff",
                    blockType: BlockType.COMMAND,
                    text: "servo [ServoID] off",
                    arguments: {
                        ServoID: {
                            type: ArgumentType.STRING,
                            menu: "servoList",
                            defaultValue: "gripper",
                        },
                    },
                },
                {
                    opcode: "positionChanged",
                    blockType: BlockType.HAT,
                    text: "when postion changed",
                },
                {
                    opcode: "shoulderPos",
                    blockType: BlockType.REPORTER,
                    text: "shoulder",
                },
                {
                    opcode: "upperArmPos",
                    blockType: BlockType.REPORTER,
                    text: "upper arm",
                },
                {
                    opcode: "forearmPos",
                    blockType: BlockType.REPORTER,
                    text: "forearm",
                },
                {
                    opcode: "handPos",
                    blockType: BlockType.REPORTER,
                    text: "hand",
                },
                {
                    opcode: "gripperPos",
                    blockType: BlockType.REPORTER,
                    text: "gripper",
                },
                {
                    opcode: "xPos",
                    blockType: BlockType.REPORTER,
                    text: "x",
                },
                {
                    opcode: "yPos",
                    blockType: BlockType.REPORTER,
                    text: "y",
                },
                {
                    opcode: "zPos",
                    blockType: BlockType.REPORTER,
                    text: "z",
                },
                {
                    opcode: "targetOffset",
                    blockType: BlockType.COMMAND,
                    text: "set target offset to x:[X] y:[Y] z:[Z]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "ledOn",
                    blockType: BlockType.COMMAND,
                    text: "led on [Hex]",
                    arguments: {
                        Hex: {
                            type: ArgumentType.COLOR,
                        },
                    },
                },
                {
                    opcode: "ledOff",
                    blockType: BlockType.COMMAND,
                    text: "led off",
                },
                {
                    opcode: "play",
                    blockType: BlockType.COMMAND,
                    text: "play [Notes]",
                    arguments: {
                        Notes: {
                            type: ArgumentType.STRING,
                            defaultValue: "C,E-16,R,C4-2",
                        },
                    },
                },
                {
                    opcode: "buttonPressed",
                    blockType: BlockType.HAT,
                    text: "when button pressed",
                },
                {
                    opcode: "isLongButton",
                    blockType: BlockType.BOOLEAN,
                    text: "was a long button pressed",
                },
                {
                    opcode: "getButtonPressCount",
                    blockType: BlockType.REPORTER,
                    text: "button press count",
                },
                {
                    opcode: "resetButtonPressCount",
                    blockType: BlockType.COMMAND,
                    text: "reset button press count",
                },
                {
                    opcode: "knobTurned",
                    blockType: BlockType.HAT,
                    text: "when knob turned",
                },
                {
                    opcode: "setKnobPosition",
                    blockType: BlockType.COMMAND,
                    text:
                        "set knob position:[Position] min:[MinRange] max:[MaxRange]",
                    arguments: {
                        Position: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        MinRange: {
                            type: ArgumentType.NUMBER,
                            defaultValue: -100,
                        },
                        MaxRange: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                        },
                    },
                },
                {
                    opcode: "getKnobPosition",
                    blockType: BlockType.REPORTER,
                    text: "knob position",
                },
                {
                    opcode: "speak",
                    blockType: BlockType.COMMAND,
                    text: "speak [Text]",
                    arguments: {
                        Text: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                    },
                },
                {
                    opcode: "speakWait",
                    blockType: BlockType.COMMAND,
                    text: "speak [Text] and wait",
                    arguments: {
                        Text: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                    },
                },
                {
                    opcode: "stopSpeaking",
                    blockType: BlockType.COMMAND,
                    text: "stop speaking",
                },
                {
                    opcode: "changeVoice",
                    blockType: BlockType.COMMAND,
                    text: "change voice to [Male]",
                    arguments: {
                        Male: {
                            type: ArgumentType.STRING,
                            defaultValue: "male",
                            menu: "genderList",
                        },
                    },
                },
                {
                    opcode: "isSpeaking",
                    blockType: BlockType.BOOLEAN,
                    text: "is speaking",
                },
                {
                    opcode: "whenHeard",
                    blockType: BlockType.HAT,
                    text: "when heard [Choice]",
                    arguments: {
                        Choice: {
                            type: ArgumentType.STRING,
                            defaultValue: "red",
                        },
                    },
                },
                {
                    opcode: "listenFor",
                    blockType: BlockType.COMMAND,
                    text: "listen continually for [Choices]",
                    arguments: {
                        Choices: {
                            type: ArgumentType.STRING,
                            defaultValue: "red, green, blue",
                        },
                    },
                },
                {
                    opcode: "listenForWait",
                    blockType: BlockType.COMMAND,
                    text: "listen once for [Choices] and wait",
                    arguments: {
                        Choices: {
                            type: ArgumentType.STRING,
                            defaultValue: "red, green, blue",
                        },
                    },
                },
                {
                    opcode: "stopListening",
                    blockType: BlockType.COMMAND,
                    text: "stop listening",
                },
                {
                    opcode: "lastHeard",
                    blockType: BlockType.REPORTER,
                    text: "last heard",
                },
                {
                    opcode: "isListening",
                    blockType: BlockType.BOOLEAN,
                    text: "is listening",
                },
                {
                    opcode: "isConnected",
                    blockType: BlockType.BOOLEAN,
                    text: "is connected",
                },
                {
                    opcode: "whenConnected",
                    blockType: BlockType.HAT,
                    text: "when [Connection]",
                    arguments: {
                        Connection: {
                            type: ArgumentType.STRING,
                            defaultValue: "connected",
                            menu: "connectionList",
                        },
                    },
                },
            ],
            menus: {
                recordingList: {
                    acceptReporters: true,
                    items: "getRecordingList",
                },
                servoList: [
                    "shoulder", 
                    "upper arm",
                    "forearm",
                    "hand",
                    "gripper",
                ],
                syncronizedList: [
                    "synchronized",
                    "unsynchronized",
                ],
                genderList: [
                    "male",
                    "female",
                ],
                connectionList: [
                    "connected",
                    "disconnected",
                ],
            },
        };
    }

    send(cmd, params, fetchOptions) {
        //generate url
        let url = apiUrl + cmd;
        if (params) {
            let paramStr = "";
            for (var name in params) {
                if (params[name] !== undefined)
                    paramStr += name + "=" + params[name] + "&";
            }
            if (paramStr.length > 0) {
                url += "?" + paramStr.substring(0, paramStr.length - 1);
            }
        }

        //send request
        fetchOptions = fetchOptions || {};
        const timeout = fetchOptions.timeout || 2000;
        const controller = new AbortController();
        const options = {
            cache: "no-store",
            signal: controller.signal,
            ...fetchOptions,
        };
        const abortId = setTimeout(() => controller.abort(), timeout);
        return fetch(url, options)
            .finally(() => {
                clearTimeout(abortId);
            })
            .then((result) => {
                if (result.ok) return result.text();
                return Promise.reject();
            })
            .then((jsonStr) => {
                if (jsonStr) return JSON.parse(jsonStr);
                return undefined; //if json is blank but status is OK retun undefined
            });
    }

    getRecordingList() {
        return this._recordingList;
    }

    refreshRecordingList() {
        this.send("GetRecordings").then(
            (result) => {
                this._recordingList = result;
            },
            () => {
                this._recordingList = noRecordings;
            }
        );
    }

    getServoID(name) {
        switch (name) {
            case "shoulder":
                return 1;
            case "upper arm":
                return 2;
            case "forearm":
                return 3;
            case "hand":
                return 4;
            case "gripper":
                return 5;
            default:
                return 1;
        }
    }

    getSyncronizedValue(name) {
        switch (name) {
            case "synchronized":
                return "true";
            case "unsynchronized":
                return "false";
            default:
                return "false";
        }
    }

    getGenderValue(name) {
        switch (name) {
            case "male":
                return "true";
            case "female":
                return "false";
            default:
                return "true";
        }
    }

    getConnectionValue(name) {
        switch (name) {
            case "connected":
                return true;
            case "disconnected":
                return false;
            default:
                return false;
        }
    }

    autoSetParameters(block) {
        const blockContainer = this._runtime._editingTarget.blocks;

        let updated = true;
        switch (block.opcode.replace(simplearmKeyPrefix,"")) {
            case "servoMoveTarget":
                if (this.xPos() != 0 || this.yPos() != 0 || this.zPos() != 0) {
                    this.setParameterValue(blockContainer, block, "X", this.xPos());
                    this.setParameterValue(blockContainer, block, "Y", this.yPos());
                    this.setParameterValue(blockContainer, block, "Z", this.zPos());
                }
                break;
            case "servoMoveAll":
                this.setParameterValue(blockContainer, block, "Servo1Pos", this.shoulderPos());
                this.setParameterValue(blockContainer, block, "Servo2Pos", this.upperArmPos());
                this.setParameterValue(blockContainer, block, "Servo3Pos", this.forearmPos());
                this.setParameterValue(blockContainer, block, "Servo4Pos", this.handPos());
                this.setParameterValue(blockContainer, block, "Servo5Pos", this.gripperPos());
                break;
            case "whenHeard":
                if (this.lastHeard()){
                    this.setParameterValue(blockContainer, block, "Choice", this.lastHeard());
                }
                break;
            default:
                updated = false;
                break;
        }

        //refresh the block in the UI
        if (updated) {
            this._blocksRefreshing = true;
            this._runtime.requestBlocksUpdate();
            setTimeout(() => this._blocksRefreshing = false,400);
        }
    }

    getParameterValue(blockContainer, block, param) {
        const paramBlock = blockContainer.getBlock(block.inputs[param].shadow);
        if (paramBlock) {
            return paramBlock.fields[Object.keys(paramBlock.fields)[0]].value;
        }
    }

    setParameterValue(blockContainer, block, param, value) {
        const paramBlock = blockContainer.getBlock(block.inputs[param].shadow);
        if (paramBlock) {
            paramBlock.fields[Object.keys(paramBlock.fields)[0]].value = value;
        }
    }

    ledOn({ Hex }) {
        const color = Color.hexToRgb(Hex);
        this.send("LedOn", { Red: color.r, Green: color.g, Blue: color.b });
    }

    ledOff() {
        this.send("LedOff");
    }

    play({ Notes }) {
        return this.send("Play", { Notes }, { timeout: 6000 }).then(
            (result) => {
                if (result == false) {
                    return "something is incorrect about your note format";
                }
            }
        );
    }

    playback({ Recording }) {
        if (Recording && Recording !== noRecordings[0]) {
            return this.send("Playback", { Recording });
        } else
            return "a movement must be selected.  create a new movement in Motion Studio.";
    }

    playbackFrom({ Recording, StartDescription, EndDescription }) {
        if (Recording && Recording !== noRecordings[0]) {
            this.send("Playback", {
                Recording,
                StartDescription,
                EndDescription,
            });
        } else
            return "a movement must be selected.  create a new movement in Motion Studio.";
    }

    servosStop() {
        this.send("ServosStop");
    }

    servosOff() {
        this.send("ServosOff");
    }

    servoPosition({ ServoID, Position }) {
        this.send("ServoPosition", {
            ServoID: this.getServoID(ServoID),
            Position,
        });
    }

    servoMove({ ServoID, Position }) {
        this.send("ServoMove", {
            ServoID: this.getServoID(ServoID),
            Position,
        });
    }

    servoMoveAll({ Servo1Pos, Servo2Pos, Servo3Pos, Servo4Pos, Servo5Pos }) {
        this.send("ServoMoveAll", {
            Servo1Pos,
            Servo2Pos,
            Servo3Pos,
            Servo4Pos,
            Servo5Pos,
        });
    }

    servoMoveTarget({ X, Y, Z }) {
        this.send("ServoMoveTarget", { X, Y, Z });
    }

    moveSettings({ Speed, EaseIn, EaseOut, Sync }) {
        this.send("MoveSettings", {
            Speed,
            EaseIn,
            EaseOut,
            Sync: this.getSyncronizedValue(Sync),
        });
    }

    servoOff({ ServoID }) {
        this.send("ServoOff", { ServoID: this.getServoID(ServoID) });
    }

    moveWait() {
        return this.send("MoveWait", null, { timeout: 120000 }).then(
            (result) => {
                if (result) {
                    return "movement done";
                }
            }
        );
    }

    targetOffset({ X, Y, Z }) {
        this.send("TargetOffset", { X, Y, Z });
    }

    buttonPressed() {
        if (this._isButtonPressed === true) {
            this._isButtonPressed = false;
            return true;
        }
        return false;
    }

    knobTurned() {
        if (this._isKnobTurned === true) {
            this._isKnobTurned = false;
            return true;
        }
        return false;
    }

    positionChanged() {
        if (this._isPositionChanged === true) {
            this._isPositionChanged = false;
            return true;
        }
        return false;
    }

    isMoving() {
        return this.send("IsMoving");
    }

    isLongButton() {
        return this._isLongButton;
    }

    getButtonPressCount() {
        return this._buttonPressCount;
    }

    resetButtonPressCount() {
        this.send("ResetButtonPressCount").then(
            () => (this._buttonPressCount = 0)
        );
    }

    setKnobPosition({ Position, MinRange, MaxRange }) {
        this.send("SetKnobPosition", {
            Position,
            MinRange,
            MaxRange,
        });
    }

    getKnobPosition() {
        return this._knobPosition;
    }

    shoulderPos() {
        return this._shoulderPos;
    }

    upperArmPos() {
        return this._upperArmPos;
    }

    forearmPos() {
        return this._forearmPos;
    }

    handPos() {
        return this._handPos;
    }

    gripperPos() {
        return this._gripperPos;
    }

    xPos() {
        return this._xPos;
    }

    yPos() {
        return this._yPos;
    }

    zPos() {
        return this._zPos;
    }

    speak({ Text }) {
        if (!Text) return;
        this._isSpeaking = true;
        return this.send("Speak", { Text }).then(
            (result) => {
                if (!result) {
                    return "Speech system not enabled within Windows.  You will need to enable it within Windows settings for this to work";
                }
                this._isSpeaking = result === true;
            },
            () => {
                this._isSpeaking = false;
            }
        );
    }

    speakWait({ Text }) {
        if (!Text) return;
        this._isSpeaking = true;
        return this.send("SpeakWait", { Text }, { timeout: 6000 })
            .finally(() => {
                this._isSpeaking = false;
            })
            .then((result) => {
                if (!result) {
                    return "Speech system not enabled within Windows.  You will need to enable it within Windows settings for this to work";
                }
            });
    }

    stopSpeaking() {
        this.send("StopSpeaking");
        this._isSpeaking = false;
    }

    changeVoice({ Male }) {
        this.send("ChangeVoice", { Male: this.getGenderValue(Male) });
        this._isSpeaking = false;
    }

    isSpeaking() {
        return this._isSpeaking;
    }

    whenHeard({ Choice }) {
        if (this._lastHeardChanged === true && this._lastHeard === Choice) {
            this._lastHeardChanged = false;
            return true;
        }
        return false;
    }

    listenFor({ Choices }) {
        this._isListening = true;
        return this.send("ListenFor", { Choices }).then(
            (result) => {
                this._isListening = result === true;
            },
            () => {
                this._isListening = false;
            }
        );
    }

    listenForWait({ Choices }) {
        this._isListening = true;
        return this.send(
            "ListenForWait",
            { Choices },
            { timeout: 120000 }
        ).finally(() => {
            this._isListening = false;
        });
    }

    stopListening() {
        this.send("StopListening");
        this._isListening = false;
    }

    lastHeard() {
        return this._lastHeard;
    }

    isListening() {
        return this._isListening;
    }

    isConnected() {
        return this._isConnected;
    }

    whenConnected({ Connection }) {
        return this._isConnected == this.getConnectionValue(Connection);
    }

    listenForEvents() {
        //run once
        if (this._listeningForEvents) return;
        this._listeningForEvents = true;

        //start listening for events
        const events = () => {
            this.send("AwaitEvent", null, { timeout: 360000 })
                .then((data) => {
                    //Position
                    if (data.Position) {
                        this._shoulderPos = data.Position.Shoulder || 0;
                        this._upperArmPos = data.Position.UpperArm || 0;
                        this._forearmPos = data.Position.Forearm || 0;
                        this._handPos = data.Position.Hand || 0;
                        this._gripperPos = data.Position.Gripper || 0;
                        this._xPos = data.Position.X || 0;
                        this._yPos = data.Position.Y || 0;
                        this._zPos = data.Position.Z || 0;
                        this._isPositionChanged = true;
                    }
                    //knob
                    else if (data.Knob) {
                        this._knobPosition = data.Knob;
                        this._isKnobTurned = true;
                    }
                    //button
                    else if (data.Button) {
                        this._buttonPressCount = data.Button.Count;
                        this._isLongButton = data.Button.WasLong;
                        this._isButtonPressed = true;
                    }
                    //Recordings Changed
                    else if (data.RecordingsChanged) {
                        //refresh the recordingList
                        this.refreshRecordingList();
                    }
                    //Recognized
                    else if (data.Recognized) {
                        this._lastHeard = data.Recognized;
                        this._lastHeardChanged = true;
                    }
                    //Spoken
                    else if (data.Spoken) {
                        this._isSpeaking = false;
                    }
                    events(); //loop
                })
                .catch((error) => {
                    if (error && error.code == DOMException.ABORT_ERR) {
                        events(); //loop if just timed out from inactivity
                    }
                });
        };

        //start heartbeat to reconnect events
        const heartbeat = () => {
            this.send("Connected", null, { timeout: 4000 }).then(
                (data) => {
                    //timeout in 4 seconds
                    //success
                    if (!this._isConnected) {
                        this._isConnected = true;
                        //reconnect events
                        events();
                        //refresh the recordingList
                        this.refreshRecordingList();
                    }
                    setTimeout(() => {
                        heartbeat();
                    }, 5000); //retry in 5 sec
                },
                () => {
                    //failed
                    this._isConnected = false;
                    setTimeout(() => {
                        heartbeat();
                    }, 5000); //retry in 5 sec
                }
            );
        };
        heartbeat();
    }
}

/**activate the SimpleArm extension */
const simplearmExtension = {
    activate: (vm) => {
        var extension = new SimpleArmBlocks(vm.extensionManager.runtime);
        var serviceName = vm.extensionManager._registerInternalExtension(
            extension
        );
        vm.extensionManager._loadedExtensions.set(simplearmKey, serviceName);
    },
};
export default simplearmExtension;
