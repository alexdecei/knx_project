import asyncio
from xknx import XKNX
"""
LAMPES
0/1/1...4

RETOURS D'ETAT
0/2/1...4

BOUTONS
0/3/1...4

SSID: FING
MDP: maquettefing

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
    
    #ajout d'un device
    light = Light(xknx,
                  name='TestLight',
                  group_address_switch='0/1/1',
                  group_address_brightness='1/2/5')
    xknx.devices.add(light)

    #créé l'objet knx, peut prendre des args
    await xknx.start(state_updater=False, daemon_mode=True)
    #state: lance le processus asynchrone, synchronise les devices toutes les heure
    
    # faire des trucs avec la light
    await xknx.devices['TestLight'].set_on()
    await xknx.devices['TestLight'].set_brightness(23)
    await xknx.devices['TestLight'].set_off()

    


    await xknx.stop()
    #déconnexion des tunnels

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
