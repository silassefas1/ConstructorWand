import { world, system } from '@minecraft/server';

const WAND_ID = 'silas:constructor_wand';
const RANGE = 2; // Área 4x4 (2 blocos para cada lado)

// Função para preencher área 4x4
function fillArea(player, targetLocation) {
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
                if (block) {
                    const blockId = block.typeId;
                    
                    // Substituir ar, água e lava por pedra
                    if (blockId === 'minecraft:air' || 
                        blockId === 'minecraft:water' || 
                        blockId === 'minecraft:lava' ||
                        blockId === 'minecraft:flowing_water' ||
                        blockId === 'minecraft:flowing_lava') {
                        
                        block.setType('minecraft:stone');
                        blocksPlaced++;
                    }
                }
            } catch (error) {
                // Ignorar erros de posicionamento
                console.warn(`Erro ao colocar bloco em ${pos.x}, ${pos.y}, ${pos.z}: ${error}`);
            }
        }
    }
    
    if (blocksPlaced > 0) {
        player.sendMessage(`§a[Constructor Wand] ${blocksPlaced} blocos colocados!`);
    } else {
        player.sendMessage(`§e[Constructor Wand] Nenhum espaço encontrado para preencher!`);
    }
}

// Event listener para uso da varinha
world.beforeEvents.itemUse.subscribe((eventData) => {
    const { itemStack, source } = eventData;
    
    if (itemStack && itemStack.typeId === WAND_ID && source) {
        const player = source;
        
        // Usar a posição à frente do jogador
        const playerLocation = player.location;
        const viewDirection = player.getViewDirection();
        
        const targetLocation = {
            x: playerLocation.x + (viewDirection.x * 3),
            y: playerLocation.y - 1,
            z: playerLocation.z + (viewDirection.z * 3)
        };
        
        player.sendMessage('§6[Constructor Wand] Varinha ativada!');
        fillArea(player, targetLocation);
        
        // Cancelar o evento para evitar outros usos
        eventData.cancel = true;
    }
});

// Inicialização
system.runInterval(() => {
    // Manter o script ativo
}, 100);

console.log('Constructor Wand v1.21.100+ carregado com sucesso!');
