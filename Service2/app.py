from flask import Flask, jsonify
import socket
import psutil
import time
import os

app = Flask(__name__)
PORT = os.environ.get('PORT', 5000)

def get_ip_address():
    return socket.gethostbyname(socket.gethostname())

def get_process_list():
    processes = []
    for proc in psutil.process_iter(['pid', 'name']):
        processes.append(proc.info)
    return processes

def get_disk_space():
    
    disk = psutil.disk_usage('/')
    return {
        'diskSpace': disk,
        'diskPartitions': psutil.disk_partitions()
        # 'total': disk.total,
        # 'used': disk.used,
        # 'free': disk.free,
        # 'percent': disk.percent
    }

def get_uptime():
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    days, remainder = divmod(uptime_seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(days)}d {int(hours)}h {int(minutes)}m {int(seconds)}s"

@app.route('/', methods=['GET'])
def status():
    return jsonify({
        'ip_address': get_ip_address(),
        'processes': get_process_list(),
        'disk_space': get_disk_space(),
        'uptime': get_uptime()
    })

@app.route('/shutdown/', methods=['GET'])
def shutdown():
    print('Service2 is shutting down')
    os._exit(0)
    return jsonify({'status': 'Shutting down...'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
