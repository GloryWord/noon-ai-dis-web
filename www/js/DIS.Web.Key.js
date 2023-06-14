'use strict';

/**
 * DIS.Web.Key 네임스페이스
 * @class DIS.Web.Key
 */
DIS.Web.Key = DIS.Web.Key || {};

/**
 * DIS.Web.Key 클래스를 참조하는 글로벌 멤버 변수
 * @interface Key
 */
var key = DIS.Web.Key;
key = {
    deleteKey: function (keyIndex) {
        let result = false;

        let baseUrl = `/api/key`
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "DELETE",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                keyIndex
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = true;
                }
            }, // success 
            error: function (xhr, status) {
                result = JSON.parse(xhr.responseJSON.result)
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },

    reEncryptionAll: async function (fileName, keyName, inputOptions) {
        let complete = false;
        let count = 0;
        await Swal.fire({
            title: '변경할 키 선택',
            input: 'select',
            inputPlaceholder: '키 목록',
            inputOptions: inputOptions,
            html: `${keyName} 암호키로 비식별화한 기록을 선택한 암호키로 대체합니다.`,
            allowOutsideClick: false,
            showCancelButton: true,
            inputValidator: (value) => {
                if (value === '') return '키를 선택해 주세요'
            },
        }).then(async (result) => {
            if(result.isConfirmed) {
                let newKeyId = result.value;
                await Swal.fire({
                    title: '암호화 키 변경',
                    html: '기존 키로 암호화된 정보를 새로운 키로 암호화합니다..',
                    showCancelButton: false,
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        let baseUrl = '/api/key/re-encryption/all'
                        let apiUrl = apiUrlConverter('key', baseUrl)
                        return fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                "fileName": fileName,
                                "keyName": keyName,
                                "newKeyId": newKeyId
                            })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(response.statusText)
                                }
                                return response.json()
                            })
                            .catch(error => {
                                Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                )
                            })
                    }
                }).then((result) => {
                    if (result.value.message === 'success') {
                        complete = true;
                        count = result.value.count;
                    }
                    else Swal.fire('재 암호화 실패', '다시 시도해 주세요', 'error')
                })
            }
        })

        return { complete, count };
    },

    reEncryptionElement: async function (fileName, keyName, inputOptions, requestId) {
        let complete = false;
        let count = 0;
        await Swal.fire({
            title: '변경할 키 선택',
            input: 'select',
            inputPlaceholder: '키 목록',
            inputOptions: inputOptions,
            html: `${keyName} 암호키로 비식별화한 기록을 선택한 암호키로 대체합니다.`,
            allowOutsideClick: false,
            showCancelButton: true,
            inputValidator: (value) => {
                if (value === '') return '키를 선택해 주세요'
            },
        }).then(async (result) => {
            if(result.isConfirmed) {
                let newKeyId = result.value;
                await Swal.fire({
                    title: '암호화 키 변경',
                    html: '기존 키로 암호화된 정보를 새로운 키로 암호화합니다..',
                    showCancelButton: false,
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        let baseUrl = '/api/key/re-encryption/element'
                        let apiUrl = apiUrlConverter('key', baseUrl)
                        return fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                "fileName": fileName,
                                "keyName": keyName,
                                "newKeyId": newKeyId,
                                "requestId": requestId
                            })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(response.statusText)
                                }
                                return response.json()
                            })
                            .catch(error => {
                                Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                )
                            })
                    }
                }).then((result) => {
                    if (result.value.message === 'success') {
                        complete = true;
                        count = result.value.count;
                    }
                    else Swal.fire('재 암호화 실패', '다시 시도해 주세요', 'error')
                })
            }
        })

        return { complete, count };
    },

    // changeKeyRef: async function (from_keyIndex, to_keyIndex, to_keyName) {
    //     let complete = false;
    //     let count = 0;
    //     await Swal.fire({
    //         title: '변경할 키 선택',
    //         input: 'select',
    //         inputPlaceholder: '키 목록',
    //         inputOptions: inputOptions,
    //         html: `${curKey.key_name} 암호키로 비식별화한 기록을 선택한 암호키로 대체합니다.`,
    //         allowOutsideClick: false,
    //         showCancelButton: true,
    //         inputValidator: (value) => {
    //             if (value === '') return '키를 선택해 주세요'
    //         },
    //     }).then(async (result) => {
    //         if(result.isConfirmed) {
    //             let baseUrl = '/api/key/reference'
    //             let apiUrl = apiUrlConverter('key', baseUrl)
    //             return fetch(apiUrl, {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     "from_keyIndex": from_keyIndex,
    //                     "to_keyIndex": to_keyIndex,
    //                     "to_keyName": to_keyName,
    //                 })
    //             })
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error(response.statusText)
    //                     }
    //                     return response.json()
    //                 })
    //                 .catch(error => {
    //                     Swal.showValidationMessage(
    //                         `Request failed: ${error}`
    //                     )
    //                 })
    //         }
    //     })

    //     await Swal.fire({
    //         title: '비식별화 기록 변경',
    //         html: '기존 비식별화 기록을 새로운 키로 변경합니다..',
    //         showCancelButton: false,
    //         showLoaderOnConfirm: true,
    //         preConfirm: () => {
    //             let baseUrl = '/api/key/reference'
    //             let apiUrl = apiUrlConverter('key', baseUrl)
    //             return fetch(apiUrl, {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     "from_keyIndex": from_keyIndex,
    //                     "to_keyIndex": to_keyIndex,
    //                     "to_keyName": to_keyName,
    //                 })
    //             })
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error(response.statusText)
    //                     }
    //                     return response.json()
    //                 })
    //                 .catch(error => {
    //                     Swal.showValidationMessage(
    //                         `Request failed: ${error}`
    //                     )
    //                 })
    //         }
    //     }).then((result) => {
    //         if (result.value.message === 'success') {
    //             complete = true;
    //             count = result.value.count;
    //         }
    //         else Swal.fire('기록 변경 실패', '다시 시도해 주세요', 'error')
    //     })
    //     return { complete, count }
    // },

    changeKeyAll: async function (socket, keyIndex) {
        let changed = false;
        let count = 0;
        let baseUrl = '/api/key/all'
        let apiUrl = apiUrlConverter('key', baseUrl)

        let keyList = null;
        let auth = null;

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                keyList = data.keyList;
                auth = data.auth;
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        keyList = keyList.map(({ id, key_name }) => ({ id, key_name }));

        let curKey = {};
        let inputOptions = {};
        for (let i = 0; i < keyList.length; i++) {
            inputOptions[keyList[i].id] = keyList[i].key_name;
            if (keyList[i].id === keyIndex) {
                curKey.id = keyList[i].id
                curKey.key_name = keyList[i].key_name;
            }
        }

        delete inputOptions[keyIndex];

        let valid = false;
        let msg, upload_result, keyPath;

        const { value: file } = await Swal.fire({
            title: '키 업로드',
            text: '기존 사용중 키를 업로드 해 주세요',
            input: 'file',
            inputAttributes: {
                'accept': '.pem',
                'id': 'file',
            }
        })

        if (file) {
            [upload_result, keyPath] = await fileModule.uploadKey('swal2-file');
            let uploadID = makeid(6);
            socket.emit('delUploadedFile', {
                filePath: keyPath,
                id: uploadID,
                immediate: 'false'
            })
            let fileName = upload_result;
            const verify_result = await fileModule.verifyKey(fileName, curKey.key_name);
            valid = verify_result.valid;
            msg = verify_result.msg;

            if (valid) {
                let reEncrypted = await key.reEncryptionAll(fileName, curKey.key_name, inputOptions);
                changed = reEncrypted.complete;
                count = reEncrypted.count;
            }
            else {
                Swal.fire({
                    title: '복호화 키 불일치',
                    text: msg,
                    showCancelButton: false,
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        }
        return { changed, count };
    },

    changeKeyElement: async function (socket, keyIndex, requestId) {
        let changed = false;
        let count = 0;
        let baseUrl = '/api/key/all'
        let apiUrl = apiUrlConverter('key', baseUrl)

        let keyList = [];
        let auth = null;

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                keyList = data.keyList;
                auth = data.auth;
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        keyList = keyList.map(({ id, key_name }) => ({ id, key_name }));

        let curKey = {};
        let inputOptions = {};
        for (let i = 0; i < keyList.length; i++) {
            inputOptions[keyList[i].id] = keyList[i].key_name;
            if (keyList[i].id === keyIndex) {
                curKey.id = keyList[i].id
                curKey.key_name = keyList[i].key_name;
            }
        }

        delete inputOptions[keyIndex];

        let valid = false;
        let msg, upload_result, keyPath;

        const { value: file } = await Swal.fire({
            title: '키 업로드',
            text: '기존 사용중 키를 업로드 해 주세요',
            input: 'file',
            inputAttributes: {
                'accept': '.pem',
                'id': 'file',
            }
        })

        if (file) {
            [upload_result, keyPath] = await fileModule.uploadKey('swal2-file');
            let uploadID = makeid(6);
            socket.emit('delUploadedFile', {
                filePath: keyPath,
                id: uploadID,
                immediate: 'false'
            })
            
            let fileName = upload_result;
            const verify_result = await fileModule.verifyKey(fileName, curKey.key_name);
            valid = verify_result.valid;
            msg = verify_result.msg;

            if (valid) {
                let reEncrypted = await key.reEncryptionElement(fileName, curKey.key_name, inputOptions, requestId);
                changed = reEncrypted.complete;
                count = reEncrypted.count;
            }
            else {
                Swal.fire({
                    title: '복호화 키 불일치',
                    text: msg,
                    showCancelButton: false,
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        }
        return { changed, count };
    },

    removeKeyRef: function (keyIndex) {
        let result = false;

        let baseUrl = `/api/key/reference`
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "PATCH",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                keyIndex
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = true;
                }
            }, // success 
            error: function (xhr, status) {
                result = JSON.parse(xhr.responseJSON.result)
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },

    disableNotification: async function (keyIndex) {
        let baseUrl = '/api/key/notification'
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "PATCH",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                keyIndex
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    
                }
            }, // success 
            error: function (xhr, status) {
                result = JSON.parse(xhr.responseJSON.result)
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    }
}