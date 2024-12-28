const bikeSchema = require("../model/bikeSchema")
// const noble = require('noble');
// const noble = require('@abandonware/bluetooth-hci-socket');
const net = require('net');
const crypto = require('crypto');
const axios = require('axios');
let connectedPeripheral = null;

const omniLockUUID = '1697681544';
const omniLockUUID1 = '860537066127309';
const lockCharacteristicUUID = 'YOUR_LOCK_CHARACTERISTIC_UUID';

const devices = [
    {
      KEY: "1697681544",
      IMEI: "860537066127309"
    },
    {
      KEY: "1697681541",
      IMEI: "860537066144981"
    },
    {
      KEY: "1697681545",
      IMEI: "860537066127648"
    },
    {
      KEY: "1697681543",
      IMEI: "860537066127960"
    },
    {
      KEY: "1697681540",
      IMEI: "860537066127523"
    },
    {
      KEY: "1697681542",
      IMEI: "861005070212227"
    }
  ];
  

const createBike = (req, res) => {
    const {status, station,  BikeCode, bikename, type, name, description, image, pricerange, telephone, available, pricePerHour, pricePerDay, wheelsize, tires, manufactured } = req.body
    const bike = new bikeSchema({
        bikename,
        type,
        description,
        image,
        pricerange,
        telephone,
        available,
        pricePerHour,
        pricePerDay,
        wheelsize,
        tires,
        manufactured,
        BikeCode,
        status,
        station,
    })

    bike.save()
        .then(data => {
            res.status(200).json({
                message: "bike created successfully",
                data
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

const getAllBikes = (req, res) => {
    bikeSchema.find()
        .sort({ "createdAt": "desc" })
        .then(data => {
            res.status(200).json({
                message: "Bikes fetched successfully",
                Bikes: data
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const DeleteBike = (req, res) => {
    const {id} = req.body
    bikeSchema.findOneAndDelete({_id : id})
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "bike does not exist"
            })
        }
        res.status(200).json({
            message: "bike has been deleted succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const UpdateBike = (req, res) => {
    const {bikeCode, status, station, id} = req.body
    bikeSchema.findOneAndUpdate({_id : id}, {station:station, status: status, BikeCode:bikeCode})
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "Bike does not exist"
            })
        }
        res.status(200).json({
            message: "Bike has been updated succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const TextBike = (req, res) => {
    const {key} = req.body
    if(key != omniLockUUID){
        return  res.status(400).json({
            message: "Invalid lock device code connection was establish"
        })
    }

    return  res.status(400).json({
        message: "Error while connecting: Device is out of range",
    })

    noble.on('stateChange', (state) => {
        console.log(state)
        if (state === 'poweredOn') {
            noble.startScanning([], false);
            console.log("start scanning")
        } else {
            noble.stopScanning();
            console.log("stop scanning")
        }
    });

    noble.on('scanStart', (state) => {
        console.log("scan start: ", state)
    });

    noble.on('scanStop', (state) => {
        console.log("scan stop: ", state)
    });
    
    

    noble.on('discover', (peripheral) => {
        console.log('Discovered:', peripheral.advertisement);

        peripheral.connect((error) => {
            if (error) {
                console.error('Connection error:', error);
                res.status(500).send('Failed to connect');
                return;
            }

            console.log('Connected to', peripheral.uuid);
            connectedPeripheral = peripheral;

            peripheral.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
                if (err) {
                    console.error('Service discovery error:', err);
                    res.status(500).send('Failed to discover services');
                    return;
                }

                const lockCharacteristic = characteristics.find(char => char.uuid === lockCharacteristicUUID);

                if (lockCharacteristic) {
                    res.status(200).send('Connected successfully');
                } else {
                    res.status(404).send('Lock characteristic not found');
                }
            });
        });
    });

}

const newBike = (res , req) => {
    const deviceIp = 'www.omnibike.net'; // Replace with the actual IP of the Omni device
    const devicePort = 9686; // Replace with the actual port
    const time_ = getCurrentFormattedDateTime()
    const deviceIp2 = 'iot.omnibike.net';
    const devicePort2 = 9682;

    // Create a TCP client
    const client = new net.Socket();

    client.connect(devicePort2, deviceIp2, () => {
        console.log('Connected to Omni device');

        // Command to send to the Omni device (e.g., unlock command)
        const command = `0xFFFF*CMDR,OM,${omniLockUUID1},${time_},L0,0,1234<LF>`; // The command format depends on the Omni protocol
        var a = client.write(command, "utf8", (() => {
            console.log('Command sent:', command, time_ );
        }));
        var ar = client.address()
        console.log( a, ar)
    });

    client.on('data', (data) => {
        console.log('Received:', data.toString());
    
        // Close the connection after receiving a response
        client.destroy();
    });
    
    client.on('close', () => {
        console.log('Connection closed');
    });
    
    client.on('error', (err) => {
        console.error('Error:', err);
    });
}

function getCurrentFormattedDateTime() {
    const now = new Date();

    // Extract date components
    const year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1 and pad with zero if necessary
    const day = ('0' + now.getDate()).slice(-2); // Get day and pad with zero if necessary

    // Extract time components
    const hours = ('0' + now.getHours()).slice(-2); // Get hours and pad with zero if necessary
    const minutes = ('0' + now.getMinutes()).slice(-2); // Get minutes and pad with zero if necessary
    const seconds = ('0' + now.getSeconds()).slice(-2); // Get seconds and pad with zero if necessary

    // Combine all components into the desired format
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return formattedDateTime;
}

const unlockDevice = async (req, res) => {
    let currentTime = Math.floor(Date.now() / 1000);
    let oneHourLater = currentTime + 3600;
    const {key} = req.body


    const device = devices.find(device => device.KEY === key);

    if(!device){
        return res.status(404).json({"message" : "Device does not exist"})
    }

   let jsonStr = `{
        "developerId": "1793307875029913601",
        "command": "L0",
        "imei": ${device.IMEI}
    }`;

    let params = JSON.parse(jsonStr);
    let sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');

    let secretKey = '412eb6db2a704a27b385868075fcf720';
    let dataToHash = `${sortedParams}&requestKey=${secretKey}`;

    let hash = crypto.createHash('md5').update(dataToHash).digest('hex');

    try {
         // Data to be sent in the POST request
        const postData = {
            "developerId" : "1793307875029913601", 
            "sign": hash,
            "command": "L0",
            "imei":  device.IMEI
        };

        // Send a GET request to an external API
        const response = await axios.post('https://iot.omnibike.net/prod-api/iot/api/v2/request', postData);
    
        // Send the response data back to the client
        res.status(200).json({data: response.data, hash, device});
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }

    // console.log(hash, dataToHash, body_);
}

const lockDevice = async (req, res) => {
    let currentTime = Math.floor(Date.now() / 1000);
    let oneHourLater = currentTime + 3600;
    const body_ = req.body

    //6ddfc7037bd64db91069cdd727601334  lock
    //4f35dc0894db9aa0bb8cbe1dd2592fb4 unlock
    //4797f0eeac40bd7f9d5e72f935f9eeab heartBeat

   let jsonStr = `{
        "developerId": "1793307875029913601",
        "command": "L0",
        "imei": "860537066127309",
        "requestAction" : "0"
    }`;

    let params = JSON.parse(jsonStr);
    let sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');

    let secretKey = '412eb6db2a704a27b385868075fcf720';
    let dataToHash = `${sortedParams}&requestKey=${secretKey}`;

    let hash = crypto.createHash('md5').update(dataToHash).digest('hex');

    try {
         // Data to be sent in the POST request
        const postData = {
            "developerId" : "1793307875029913601", 
            "sign": "8fd0fd891a0a9b8772fea876a43497d4",
            "command": "L0",
            "requestAction" : "0",
            "imei": "860537066127309"
        };

        // Send a GET request to an external API
        const response = await axios.post('https://iot.omnibike.net/prod-api/iot/api/v2/request', postData);
    
        // Send the response data back to the client
        res.status(200).json({data: response.data, hash});
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }

    // console.log(hash, dataToHash, body_);
}

const establish = (req, res) => {
    return res.status(200).json({
        code: "200",
    })
}



module.exports = {
    createBike,
    getAllBikes,
    TextBike,
    DeleteBike,
    UpdateBike,
    newBike,
    unlockDevice,
    lockDevice,
    establish
}
