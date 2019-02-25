import asyncio
from xknx import XKNX
from xknx.devices import Light
from xknx.io import GatewayScanner
from xknx.io import ConnectionConfig
from xknx.io import ConnectionType
"""
LAMPES
0/1/1...4

RETOURS D'ETAT
0/2/1...4

BOUTONS
0/3/1...4

SSID: FING
MDP: maquettefing1

"""

#fonction callback lors de la reception d'un telegram
async def telegram_received_cb(telegram):
    print("Telegram received: {0}".format(telegram))

Address = "192.168.0.5"


async def main():
#définie la fonction comme asynchrone
    xknx = XKNX(config='xknx.yaml', #fichier d'info de l'objet
            loop=loop, #points to the asyncio.loop object
            own_address= Address,
            telegram_received_cb=print("coucou"),
            device_updated_cb=print("truc"))
    
    connection_config = ConnectionConfig(
        connection_type=ConnectionType.TUNNELING,
        gateway_ip="192.168.1.2", gateway_port=3671,
        local_ip="192.168.1.109")
    
    gatewayscanner = GatewayScanner(xknx)
    gateways = await gatewayscanner.scan()
    
    if not gateways:
        print("NO GATEWAY FOUNDE")
        
    else:
        for gateway in gateways:
            print("Gateway found: {0} / {1}:{2}".format(
                gateway.name,
                gateway.ip_addr,
                gateway.port))
            if gateway.supports_tunnelling:
                print("- Device supports tunneling")
            if gateway.supports_routing:
                print("- Device supports routing, connecting via {0}".format(
                    gateway.local_ip))

    #ajout d'un device
    light = Light(xknx,
                  name='TestLight',
                  group_address_switch='0/1/1',
                  group_address_brightness='1/2/5')

    #créé l'objet knx, peut prendre des args
    await xknx.start(state_updater=False, daemon_mode=True)
    #state: lance le processus asynchrone, synchronise les devices toutes les heure
    
    # faire des trucs avec la light
    await light.set_on()
    await asyncio.sleep(2)
    await light.set_off()
    await xknx.stop()
    #déconnexion des tunnels

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()