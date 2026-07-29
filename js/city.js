openProfile() {
        const p = GameEngine.state.profile;
        const s = GameEngine.state.stats;
        
        let traitsHtml = GameEngine.state.traits.map(t => TRAITS_DB[t] ? TRAITS_DB[t].name : t).join(', ');
        if (traitsHtml === '') traitsHtml = "Aucun";

        const html = `
            <div style="text-align: left;">
                <p><strong>Rang :</strong> ${p.rank}</p>
                <p><strong>Traits :</strong> <span style="color:var(--primary-blue);">${traitsHtml}</span></p>
                <hr style="border-color: var(--border-color); margin: 10px 0;">
                <p>💪 Force : ${s.strength}</p>
                <p>🏃 Agilité : ${s.agility}</p>
                <p>🧠 Intelligence : ${s.intelligence}</p>
                <p>👁️ Perception : ${s.perception}</p>
                <p>🛡️ Vitalité : ${s.vitality}</p>
            </div>
            <button class="btn outline full-width" style="margin-top:15px;" onclick="CityManager.closeModal()">Fermer</button>
            <button class="btn system full-width" style="margin-top:10px;" onclick="CityManager.closeModal(); GameEngine.showSummary(false);">Prendre sa retraite</button>
        `;
        this.showModal("Dossier Chasseur", "", html);
    },
