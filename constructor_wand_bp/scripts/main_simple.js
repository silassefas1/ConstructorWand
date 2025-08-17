import { world, system } from '@minecraft/server';

const WAND_ID = 'silas:constructor_wand';
const RANGE = 2; // Área 4x4 (2 blocos para cada lado)

// Função simplificada para preencher área
function fillAreaSimple(player, targetLocation) {
    const dimension = player.dimension;
    let blocksPlaced = 0;
    
    // Preencher área 4x4 ao redor da posição alvo
    for (let x = -RANGE; x <= RANGE; x++) {
        for (let z = -RANGE; z <= RANGE; z++) {
            const pos = {
                x: Math.floor(targetLocation.x + x),
                y: Math.floor(targetLocation.y),
                z: Math.floor(targetLocation.z + z)
            };
            
            try {
                const block = dimension.getBlock(pos);
                if (block && (block.typeId === 'minecraft:air' || 
                             block.typeId === 'minecraft:water' || 
                             block.typeId === 'minecraft:lava')) {
                    
                    // Usar pedra como bloco padrão
                    dimension.setBlockType(pos, 'minecraft:stone');
                    blocksPlaced++;
                }
            } catch (error) {
                // Ignorar erros de posicionamento
            }
        }
    }
    
    if (blocksPlaced > 0) {
        player.sendMessage(`§a[Constructor Wand] ${blocksPlaced} blocos colocados!`);
    } else {
        player.sendMessage(`§e[Constructor Wand] Nenhum espaço vazio encontrado!`);
    }
}

// Event listener para uso da varinha
world.beforeEvents.itemUse.subscribe((eventData) => {
    const { itemStack, source } = eventData;
    
    if (itemStack.typeId === WAND_ID) {
        const player = source;
        
        // Usar a posição do jogador como referência
        const playerLocation = player.location;
        const targetLocation = {
            x: playerLocation.x,
            y: playerLocation.y - 1, // Um bloco abaixo do jogador
            z: playerLocation.z
        };
        
        player.sendMessage('§6[Constructor Wand] Varinha ativada!');
        fillAreaSimple(player, targetLocation);
    }
});

system.runInterval(() => {
    // Loop principal vazio - necessário para manter o script ativo
}, 20);

console.log('Constructor Wand carregado!');
