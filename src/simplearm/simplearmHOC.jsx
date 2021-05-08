import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectUnchanged } from '../reducers/project-changed';
import downloadBlob from '../lib/download-blob';
import simplearmExtension from '../simplearm/simplearmExtension';

const JSZip = require('jszip');

const simplearmHOC = (WrappedComponent) => (props) => {

    //hooks
    const dispatch = useDispatch();
    const vm = useSelector(state => state.scratchGui.vm);
    const projectTitle = useSelector(state => state.scratchGui.projectTitle);

    const loadSimplearmExtention = vm => {
        simplearmExtension.activate(vm);
    };

    const getThumbnail = (vm, callback) => {
        vm.postIOData('video', {forceTransparentPreview: true});
        vm.renderer.requestSnapshot(dataURI => {
            vm.postIOData('video', {forceTransparentPreview: false});
            callback(dataURI);
        });
        vm.renderer.draw();
    };

    const convertDataURIToBinary = (dataURI) => {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for(let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    const save = () => {

        //get thumbnail
        getThumbnail(vm, dataURI => {

            //get project file
            vm.saveProjectSb3().then((data) => {

                //add thumbnail to file
                JSZip.loadAsync(data).then(zip => {
                    zip.file("thumbnail.png", convertDataURIToBinary(dataURI));
                    zip.generateAsync({
                        type: 'blob',
                        mimeType: 'application/x.scratch.sb3.simplearm',
                        compression: 'DEFLATE',
                        compressionOptions: { level: 6 }
                    }).then (file => {

                        //dowload the file
                        downloadBlob(`${projectTitle}.sb3`, file);

                        //get saved name

                        //update project title

                        //tell the UI it saved successfuly
                        dispatch(setProjectUnchanged());
                    });
                });
            });
        });
    };

    return (<WrappedComponent {...props} backpackVisible={false} showComingSoon={false} canSave={true} onClickLogo={() =>{}} onVmInit={loadSimplearmExtention} simplearmSave={save} />);
};
export default simplearmHOC;