#!/bin/sh

# set variables for the chain
VALIDATOR_NAME=validator1
CHAIN_ID=frain
KEY_NAME=frain-key
KEY_2_NAME=frain-key-2
KEY_RELAY=frain-relay
CHAINFLAG="--chain-id ${CHAIN_ID}"
TOKEN_AMOUNT="10000000000000000000000000stake"
STAKING_AMOUNT="1000000000stake"

# query the DA Layer start height, in this case we are querying
# our local devnet at port 26657, the RPC. The RPC endpoint is
# to allow users to interact with Celestia's nodes by querying
# the node's state and broadcasting transactions on the Celestia
# network. The default port is 26657.
DA_BLOCK_HEIGHT=$(curl http://0.0.0.0:26657/block | jq -r '.result.block.header.height')

CONTAINER_ID=$(podman ps | grep celestia | cut -d ' ' -f1)
AUTH_TOKEN=$(podman exec $CONTAINER_ID celestia bridge auth admin --node.store /home/celestia/bridge)

# rollkit logo
cat <<'EOF'

                 :=+++=.                
              -++-    .-++:             
          .=+=.           :++-.         
       -++-                  .=+=: .    
   .=+=:                        -%@@@*  
  +%-                       .=#@@@@@@*  
    -++-                 -*%@@@@@@%+:   
       .=*=.         .=#@@@@@@@%=.      
      -++-.-++:    =*#@@@@@%+:.-++-=-   
  .=+=.       :=+=.-: @@#=.   .-*@@@@%  
  =*=:           .-==+-    :+#@@@@@@%-  
     :++-               -*@@@@@@@#=:    
        =%+=.       .=#@@@@@@@#%:       
     -++:   -++-   *+=@@@@%+:   =#*##-  
  =*=.         :=+=---@*=.   .=*@@@@@%  
  .-+=:            :-:    :+%@@@@@@%+.  
      :=+-             -*@@@@@@@#=.     
         .=+=:     .=#@@@@@@%*-         
             -++-  *=.@@@#+:            
                .====+*-.  

   ______         _  _  _     _  _   
   | ___ \       | || || |   (_)| |  
   | |_/ /  ___  | || || | __ _ | |_ 
   |    /  / _ \ | || || |/ /| || __|
   | |\ \ | (_) || || ||   < | || |_ 
   \_| \_| \___/ |_||_||_|\_\|_| \__|
EOF

# echo variables for the chain
echo -e "\n Your DA_BLOCK_HEIGHT is $DA_BLOCK_HEIGHT \n"

# build the frain chain with Rollkit
ignite chain build

# reset any existing genesis/chain data
frain-rollupd tendermint unsafe-reset-all

# initialize the validator with the chain ID you set
frain-rollupd init $VALIDATOR_NAME --chain-id $CHAIN_ID

# add keys for key 1 and key 2 to keyring-backend test
frain-rollupd keys add $KEY_NAME --keyring-backend test
frain-rollupd keys add $KEY_2_NAME --keyring-backend test
echo "milk verify alley price trust come maple will suit hood clay exotic" | frain-rollupd keys add $KEY_RELAY --keyring-backend test --recover

# add these as genesis accounts
frain-rollupd genesis add-genesis-account $KEY_NAME $TOKEN_AMOUNT --keyring-backend test
frain-rollupd genesis add-genesis-account $KEY_2_NAME $TOKEN_AMOUNT --keyring-backend test
frain-rollupd genesis add-genesis-account $KEY_RELAY $TOKEN_AMOUNT --keyring-backend test

# set the staking amounts in the genesis transaction
frain-rollupd genesis gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test

# collect genesis transactions
frain-rollupd genesis collect-gentxs

# copy centralized sequencer address into genesis.json
# Note: validator and sequencer are used interchangeably here
ADDRESS=$(jq -r '.address' ~/.frain-rollup/config/priv_validator_key.json)
PUB_KEY=$(jq -r '.pub_key' ~/.frain-rollup/config/priv_validator_key.json)
jq --argjson pubKey "$PUB_KEY" '.consensus["validators"]=[{"address": "'$ADDRESS'", "pub_key": $pubKey, "power": "1000", "name": "Rollkit Sequencer"}]' ~/.frain-rollup/config/genesis.json >temp.json && mv temp.json ~/.frain-rollup/config/genesis.json

# create a restart-local.sh file to restart the chain later
[ -f restart-local.sh ] && rm restart-local.sh
echo "DA_BLOCK_HEIGHT=$DA_BLOCK_HEIGHT" >>restart-local.sh
echo "AUTH_TOKEN=$AUTH_TOKEN" >>restart-local.sh

echo "frain-rollupd start --rollkit.aggregator --rollkit.aggregator --rollkit.da_auth_token=\$AUTH_TOKEN --rollkit.da_namespace 00000000000000000000000000000000000000000008e5f679bf7116cb --rollkit.da_start_height \$DA_BLOCK_HEIGHT --rpc.laddr tcp://127.0.0.1:36657 --grpc.address 127.0.0.1:9290 --p2p.laddr \"0.0.0.0:36656\" --minimum-gas-prices="0.025stake"" >>restart-local.sh

# start the chain
frain-rollupd start --rollkit.aggregator --rollkit.da_auth_token=$AUTH_TOKEN --rollkit.da_namespace 00000000000000000000000000000000000000000008e5f679bf7116cb --rollkit.da_start_height $DA_BLOCK_HEIGHT --rpc.laddr tcp://127.0.0.1:36657 --grpc.address 127.0.0.1:9290 --p2p.laddr "0.0.0.0:36656" --minimum-gas-prices="0.025stake"
