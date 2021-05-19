import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectUnchanged } from "../reducers/project-changed";
import { setProjectTitle } from "../reducers/project-title";
import { LoadingState } from "../reducers/project-state";
import downloadBlob from "../lib/download-blob";
import simplearmExtension from "../simplearm/simplearmExtension";
import { useMemo } from "react";

const JSZip = require("jszip");

const simplearmHOC = (WrappedComponent) => (props) => {
    //hooks
    const dispatch = useDispatch();
    const vm = useSelector((state) => state.scratchGui.vm);
    const projectTitle = useSelector((state) => state.scratchGui.projectTitle);
    const loadingState = useSelector(
        (state) => state.scratchGui.projectState.loadingState
    );
    const [projectID, setProjectID] = useState("");
    const [loadInfo, setLoadInfo] = useState();
    const [showLoad, setShowLoad] = useState(false);
    const newFile = loadingState === LoadingState.SHOWING_WITHOUT_ID;

    //each time a new file is loaded
    useEffect(() => {
        if (newFile) {
            //set project info
            if (loadInfo && loadInfo.fileName === projectTitle) {
                setProjectID(loadInfo.projectID);
                dispatch(setProjectTitle(loadInfo.projectName));
                setLoadInfo(undefined);

                //auto start
                if (props.isPlayerOnly) {
                    vm.start();
                }

                return;
            }

            //otherwise clear out project info
            if (projectID) setProjectID("");
            if (loadInfo) setLoadInfo(undefined);
        }
    }, [newFile]);

    const getProjectID = useCallback(() => {
        return projectID;
    }, [projectID]);

    const confirmSavedFile = useCallback(
        (projectName, projectID) => {
            //update project name
            if (projectName && projectName !== projectTitle) {
                dispatch(setProjectTitle(projectName));
            }
            //update projectID
            setProjectID(projectID);

            //mark as saved
            dispatch(setProjectUnchanged());
        },
        [dispatch]
    );

    const loadFile = useCallback(
        (fileName, projectName, projectID) => {
            setLoadInfo({ fileName, projectName, projectID }); //store load info
            setShowLoad(true);
        },
        [setProjectID]
    );

    const getElement = useCallback((selector) => {
        let element = undefined;
        if (selector.startsWith("//"))
            element = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null ).iterateNext();
        else
            element = document.querySelector(selector);
        if (element) {
            const docRect = document.body.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            if (elementRect.left >= docRect.left && elementRect.top >= docRect.top && elementRect.bottom <= docRect.bottom && elementRect.right <= docRect.right)
                return JSON.stringify(elementRect);
        }
    },[]);

    const startLoad = () => {
        setShowLoad(false);
        props.onStartSelectingFileUpload();
    };

    //set global functions
    useMemo(() => {
        window.SimpleArm = { getProjectID, confirmSavedFile, loadFile, getElement };
    }, [getProjectID, confirmSavedFile, loadFile, getElement]);

    const loadSimplearmExtention = (vm) => {
        simplearmExtension.activate(vm);
    };

    const getThumbnail = (vm, callback) => {
        vm.postIOData("video", { forceTransparentPreview: true });
        vm.renderer.requestSnapshot((dataURI) => {
            vm.postIOData("video", { forceTransparentPreview: false });
            callback(dataURI);
        });
        vm.renderer.draw();
    };

    const convertDataURIToBinary = (dataURI) => {
        const BASE64_MARKER = ";base64,";
        const base64Index =
            dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    const save = () => {
        //get thumbnail
        getThumbnail(vm, (dataURI) => {
            //get project file
            vm.saveProjectSb3().then((data) => {
                //add thumbnail to file
                JSZip.loadAsync(data).then((zip) => {
                    zip.file("thumbnail.png", convertDataURIToBinary(dataURI));
                    zip.generateAsync({
                        type: "blob",
                        mimeType: "application/x.scratch.sb3.simplearm",
                        compression: "DEFLATE",
                        compressionOptions: { level: 6 },
                    }).then((file) => {
                        //dowload the file
                        downloadBlob(`${projectTitle}.sb3`, file);
                    });
                });
            });
        });
    };

    return (
        <>
            {showLoad && (
                <button
                    id="SimpleArmLoadFile"
                    onClick={startLoad}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 10000,
                        width: 50,
                        height: 50,
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                    }}
                />
            )}
            <WrappedComponent
                {...props}
                backpackVisible={false}
                showComingSoon={false}
                canSave={true}
                onClickLogo={() => {}}
                onVmInit={loadSimplearmExtention}
                onClickSave={save}
            ></WrappedComponent>
        </>
    );
};

export default simplearmHOC;
