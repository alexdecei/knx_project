import asyncio
from xknx import XKNX
from xknx.io import GatewayScanner, Tunnel
from xknx.knx import PhysicalAddress
from xknx.devices import Light

xknx = XKNX()

    # Recherche des gateways

gatewayscanner = GatewayScanner(xknx)
gateways = gatewayscanner.scan()

if not gateways:
    print("No GATEWAYE FAOUNDEN")

gateway = gateways[0]
print(gateway)

src_address = PhysicalAddress("15.15.249")

#Connexion à la gateway

print("Connecting to {}:{} from {}".format(
    gateway.ip_addr,
    gateway.port,
    gateway.local_ip))

#    tunnel = Tunnel(
#        xknx,
#        src_address,
#        local_ip=gateway.local_ip,
#        gateway_ip=gateway.ip_addr,
#        gateway_port=gateway.port)
#
#    await tunnel.connect_udp()
#    await tunnel.connect()
#
#    await tunnel.connectionstate()
#    await tunnel.disconnect()

# pylint: disable=invalid-name
#loop = asyncio.get_event_loop()
#loop.run_until_complete(main())
#loop.close()