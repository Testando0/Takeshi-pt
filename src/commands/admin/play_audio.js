const { PREFIX } = require(`${BASE_DIR}/config`);
const fetch = require('node-fetch'); // Certifique-se de que a biblioteca 'node-fetch' está disponível/importada globalmente ou aqui.

module.exports = {
    name: "Play Música",
    description: "Pesquisa e envia o áudio de uma música do YouTube.",
    commands: ["musica", "play", "música", "music"],
    usage: `${PREFIX}play [Nome da Música]`,
    /**
     * @param {CommandHandleProps} props
     * @returns {Promise<void>}
     */
    handle: async ({ fullArgs, prefix, commandName, userJid, sendReply, sendImageFromURL, sendAudioFromURL, sendWaitReact, sendErrorReply, sendSuccessReact }) => {
        // Renomeando para 'q' para manter a consistência com o seu código de exemplo
        const q = fullArgs;

        // 1. Verificação de argumento
        if (!q.trim()) {
            return sendReply(`*Olá! Insira O Nome Da Música 🎧*\n *Exemplo:* ${prefix}${commandName} Nem É Bom Lembrar`);
        }

        try {
            // 2. Envia a reação de espera (⏳)
            await sendWaitReact();

            // 3. Busca no YouTube
            // URL da API de pesquisa (mantida a do seu exemplo)
            const apiUrl = `https://kuromi-system-tech.onrender.com/api/pesquisayt?query=${encodeURIComponent(q)}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API response status: ${response.status}`);
            
            const data = await response.json();

            if (!data || !data.formattedVideos || data.formattedVideos.length === 0) {
                await sendErrorReply("*Não Encontrei Resultados, Sinto Muito 🙁*");
                return;
            }

            const firstResult = data.formattedVideos[0];
            
            // Define a mensagem de fallback
            const N_E = "Não Disponível"; 
            
            // 4. Criação da Caption (usando 'userJid' para menção, embora o seu exemplo use 'pushname' que não está na tipagem)
            // Se você tiver o nome do usuário ('pushname') disponível em um utilitário, use-o.
            // Para este exemplo, usaremos userJid e faremos um corte se necessário.
            
            const pushname = userJid.split('@')[0]; // Exemplo simples
            const tempo = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            const caption = ` 🎧∆𝐏𝐋𝐀𝐘 - 𝐌𝐔𝐒𝐈𝐂∆🎧
✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
✘ۣۜۜ͜͡𝑼𝒔𝒖𝒂́𝒓𝒊𝒐⧽ @${pushname}     ♪

🍫𝑻𝑰𝑻𝑼𝑳𝑶⪼ ${firstResult.title || N_E}
⏳𝑻𝑬𝑴𝑷𝑶⪼ ${firstResult.duration || N_E}
🍭𝑪𝑨𝑵𝑨𝑳⪼ ${firstResult.channel || N_E}
⚡𝑽𝑰𝑬𝑾𝑺⪼ ${firstResult.views || N_E}
     
0:35 ━❍──────── ${firstResult.duration || N_E}
 ㅤㅤㅤㅤﾠ↻ ⊲ Ⅱ ⊳ ↺ 
VOLUME:  ▂▃▄▅▆▇ 100%

*${tempo}*
ılı.lıllılı.ıllı..ılı.lıllılı`;

            // 5. Envia a imagem e a legenda
            // Usa sendImageFromURL com o JID do usuário na menção
            await sendImageFromURL(
                firstResult.thumbnail || "URL_DE_LOGO_PADRAO_SE_FALHAR", // Substitua pelo seu logo padrão
                caption,
                [userJid], // Passa o userJid para a menção (@pushname)
                true // quoted: true
            );

            // 6. Envia o áudio
            // URL da API de download (mantida a do seu exemplo, mas com encode do título)
            const audioUrl = `https://kuromi-system-tech.onrender.com/api/play?name=${encodeURIComponent(firstResult.title)}`;
            
            await sendAudioFromURL(
                audioUrl,
                false, // asVoice: false (enviado como música/audio)
                true // quoted: true
            );
            
            // 7. Reação de sucesso
            await sendSuccessReact();

        } catch (e) { 
            console.error("Erro no comando PLAY:", e);
            // 8. Resposta de erro usando função nativa do Trkeshi Bot
            await sendErrorReply("*AAH NÃO! Não consegui processar a música. Tente novamente mais tarde. 🙁💔*");
        }
    },
};
