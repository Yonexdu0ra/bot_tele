import axios from 'axios'


'use strict';
(async () => {
    try {
        const { data } = await axios.get('https://quis.id.vn/')
        console.log(data)

    } catch (error) {
        console.log(error)
    }
})()