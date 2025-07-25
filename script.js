document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis Globais ---
    let allProducts = [];
    let allSales = [];
    let editingProductId = null; // Armazena o ID do produto que está sendo editado
    let currentSaleItems = []; // Array temporário para os itens da venda atual
    let currentLanguage = 'pt'; // Idioma padrão

    const PRODUCT_STORAGE_KEY = 'angeli_products';
    const SALE_STORAGE_KEY = 'angeli_sales';
    const LANGUAGE_STORAGE_KEY = 'angeli_language';

    // --- Elementos do DOM (obtidos uma vez para melhor performance) ---
    const statusMessage = document.getElementById('statusMessage');
    const productsSection = document.getElementById('productsSection');
    const salesHistorySection = document.getElementById('salesHistorySection');

    // Botões de Ação Principais
    const addProductBtn = document.getElementById('addProductBtn');
    const registerSaleBtn = document.getElementById('registerSaleBtn');
    const viewSalesHistoryBtn = document.getElementById('viewSalesHistoryBtn');
    const viewTotalStockBtn = document.getElementById('viewTotalStockBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const importDataInput = document.getElementById('importDataInput');
    const backToProductsBtn = document.getElementById('backToProductsBtn');
    // const languageSelector = document.getElementById('languageSelector'); // removido pois o seletor foi movido para modal
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const modalLanguageSelector = document.getElementById('modalLanguageSelector');

    // Elementos da Seção de Produtos
    const searchInput = document.getElementById('searchInput');
    const productsList = document.getElementById('productsList');
    const loadingProducts = document.getElementById('loadingProducts');
    const noProductsFound = document.getElementById('noProductsFound');

    // Elementos da Seção de Histórico de Vendas
    const salesList = document.getElementById('salesList');
    const loadingSales = document.getElementById('loadingSales');
    const noSalesFound = document.getElementById('noSalesFound');

    // Modais e seus elementos
    const productModal = document.getElementById('productModal');
    const productModalTitle = document.getElementById('productModalTitle');
    const productForm = document.getElementById('productForm');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const productName = document.getElementById('productName');
    const productColor = document.getElementById('productColor');
    const productSize = document.getElementById('productSize');
    const productSKU = document.getElementById('productSKU');
    const productQuantity = document.getElementById('productQuantity');
    const productPrice = document.getElementById('productPrice');
    const productImage = document.getElementById('productImage');

    const saleModal = document.getElementById('saleModal');
    const saleForm = document.getElementById('saleForm');
    const cancelSaleBtn = document.getElementById('cancelSaleBtn');
    const saleProductSelect = document.getElementById('saleProductSelect');
    const saleQuantity = document.getElementById('saleQuantity');
    const addItemToSaleBtn = document.getElementById('addItemToSaleBtn');
    const saleItemList = document.getElementById('saleItemList');
    const noSaleItems = document.getElementById('noSaleItems');
    const totalSaleAmount = document.getElementById('totalSaleAmount');
    const paymentType = document.getElementById('paymentType');
    const installmentDetails = document.getElementById('installmentDetails');
    const numInstallments = document.getElementById('numInstallments');
    const installmentValue = document.getElementById('installmentValue');
    const customerName = document.getElementById('customerName');

    const confirmModal = document.getElementById('confirmModal');
    const confirmModalTitle = document.getElementById('confirmModalTitle');
    const confirmModalMessage = document.getElementById('confirmModalMessage');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const confirmActionBtn = document.getElementById('confirmActionBtn');

    const messageBox = document.getElementById('messageBox');

    // --- Objeto de Traduções ---
    const translations = {
        pt: {
            appTitle: "Angeli - Controle de Estoque",
            lang_pt: "Português",
            lang_en: "English",
            statusLoaded: "Aplicativo Carregado (Armazenamento Local)",
            statusSaved: "Dados salvos localmente.",
            addProduct: "Adicionar Produto",
            registerSale: "Registrar Venda",
            salesHistory: "Histórico de Vendas",
            totalStock: "Visualizar Estoque",
            generateReport: "Gerar Relatório",
            exportData: "Exportar Dados",
            importData: "Importar Dados",
            yourProducts: "Seus Produtos",
            searchPlaceholder: "Pesquisar produtos por nome, SKU, cor ou tamanho...",
            loading: "Carregando...",
            noProducts: "Nenhum produto encontrado.",
            salesHistoryTitle: "Histórico de Vendas",
            backToProducts: "Voltar aos Produtos",
            loadingSales: "Carregando histórico de vendas...",
            noSales: "Nenhuma venda registrada.",
            footer: "Angeli - Controle de Estoque © 2025. Todos os direitos reservados.",
            addProductTitle: "Adicionar Novo Produto",
            editProductTitle: "Editar Produto",
            productNameLabel: "Nome do Produto",
            colorLabel: "Cor",
            sizeLabel: "Tamanho",
            skuLabel: "SKU",
            quantityLabel: "Quantidade",
            priceLabel: "Preço (R$)",
            imageURLLabel: "URL da Imagem (opcional)",
            cancel: "Cancelar",
            saveProduct: "Salvar Produto",
            selectOption: "Selecione um produto",
            addItemToSale: "Adicionar Item",
            saleItems: "Itens na Venda:",
            noSaleItems: "Nenhum item adicionado ainda.",
            totalSale: "Total da Venda:",
            paymentTypeLabel: "Tipo de Pagamento",
            cash: "À Vista",
            credit: "Crédito",
            installment: "Parcelado",
            installmentsNumber: "Número de Parcelas",
            installmentValue: "Valor por Parcela",
            customerNameLabel: "Nome do Cliente (opcional)",
            finalizeSale: "Finalizar Venda",
            confirmation: "Confirmação",
            confirm: "Confirmar",
            productAddedSuccess: "Produto adicionado com sucesso!",
            productUpdatedSuccess: "Produto atualizado com sucesso!",
            productNotFoundEdit: "Produto não encontrado para edição.",
            productDeleteConfirm: "Tem certeza que deseja excluir o produto \"<strong>{productName}</strong>\"? Esta ação é irreversível.",
            productDeleteSuccess: "Produto excluído com sucesso!",
            productNotFoundDelete: "Produto não encontrado para exclusão.",
            selectProductWarning: "Por favor, selecione um produto.",
            quantityPositiveWarning: "A quantidade deve ser um número positivo.",
            productNotFoundSale: "Produto não encontrado.",
            insufficientStock: "Quantidade em estoque insuficiente para {productName}. Disponível: {availableQuantity}",
            exceedsStock: "Adicionar {quantity} unidades de {productName} excederia o estoque. Disponível: {availableQuantity} para esta adição.",
            quantityUpdatedSale: "Quantidade de {productName} atualizada na venda.",
            itemAddedSale: "{quantity}x {productName} adicionado à venda.",
            itemRemovedSale: "Item removido da venda.",
            saleEmptyWarning: "Adicione pelo menos um item à venda para finalizar.",
            invalidInstallments: "Número de parcelas inválido para pagamento parcelado.",
            saleRegisteredSuccess: "Venda registrada com sucesso!",
            totalStockMessage: "Estoque Total: {totalUnits} unidades. Valor Total do Estoque: {totalValue}",
            reportSummary: "Resumo Angeli:<br>Valor Total do Estoque Atual: <strong class=\"text-angeli-darkpink\">{totalStockValue}</strong><br>Valor Total das Vendas Registradas: <strong class=\"text-angeli-darkpink\">{totalSalesValue}</strong>",
            dataExportSuccess: "Dados exportados com sucesso!",
            importConfirm: "Tem certeza que deseja importar dados? Isso <strong>substituirá todos os seus dados atuais</strong> de produtos e vendas.",
            dataImportSuccess: "Dados importados com sucesso! O aplicativo foi atualizado.",
            invalidJsonFormat: "Formato de arquivo JSON inválido. Esperado \"products\" e \"sales\" arrays.",
            fileReadError: "Erro ao ler o arquivo.",
            saveDataError: "Erro ao salvar dados localmente.",
            loadDataError: "Erro ao carregar dados localmente. Os dados podem estar corrompidos.",
            productNameRequired: "O nome do produto é obrigatório.",
            colorRequired: "A cor é obrigatória.",
            sizeRequired: "O tamanho é obrigatório.",
            skuRequired: "O SKU é obrigatório.",
            quantityInvalid: "A quantidade deve ser um número não negativo.",
            priceInvalid: "O preço deve ser um número não negativo.",
            invalidImageUrl: "A URL da imagem não é válida.",
            notInformed: "Não Informado",
            editButton: "Editar",
            deleteButton: "Excluir"
        },
        en: {
            appTitle: "Angeli - Stock Control",
            lang_pt: "Portuguese",
            lang_en: "English",
            statusLoaded: "Application Loaded (Local Storage)",
            statusSaved: "Data saved locally.",
            addProduct: "Add Product",
            registerSale: "Register Sale",
            salesHistory: "Sales History",
            totalStock: "View Total Stock",
            generateReport: "Generate Report",
            exportData: "Export Data",
            importData: "Import Data",
            yourProducts: "Your Products",
            searchPlaceholder: "Search products by name, SKU, color, or size...",
            loading: "Loading...",
            noProducts: "No products found.",
            salesHistoryTitle: "Sales History",
            backToProducts: "Back to Products",
            loadingSales: "Loading sales history...",
            noSales: "No sales registered.",
            footer: "Angeli - Stock Control © 2025. All rights reserved.",
            addProductTitle: "Add New Product",
            editProductTitle: "Edit Product",
            productNameLabel: "Product Name",
            colorLabel: "Color",
            sizeLabel: "Size",
            skuLabel: "SKU",
            quantityLabel: "Quantity",
            priceLabel: "Price ($)",
            imageURLLabel: "Image URL (optional)",
            cancel: "Cancel",
            saveProduct: "Save Product",
            selectOption: "Select a product",
            addItemToSale: "Add Item",
            saleItems: "Items in Sale:",
            noSaleItems: "No items added yet.",
            totalSale: "Total Sale:",
            paymentTypeLabel: "Payment Type",
            cash: "Cash",
            credit: "Credit Card",
            installment: "Installment",
            installmentsNumber: "Number of Installments",
            installmentValue: "Installment Value",
            customerNameLabel: "Customer Name (optional)",
            finalizeSale: "Finalize Sale",
            confirmation: "Confirmation",
            confirm: "Confirm",
            productAddedSuccess: "Product added successfully!",
            productUpdatedSuccess: "Product updated successfully!",
            productNotFoundEdit: "Product not found for editing.",
            productDeleteConfirm: "Are you sure you want to delete the product \"<strong>{productName}</strong>\"? This action is irreversible.",
            productDeleteSuccess: "Product deleted successfully!",
            productNotFoundDelete: "Product not found for deletion.",
            selectProductWarning: "Please select a product.",
            quantityPositiveWarning: "Quantity must be a positive number.",
            productNotFoundSale: "Product not found.",
            insufficientStock: "Insufficient stock for {productName}. Available: {availableQuantity}",
            exceedsStock: "Adding {quantity} units of {productName} would exceed stock. Available: {availableQuantity} for this addition.",
            quantityUpdatedSale: "Quantity of {productName} updated in sale.",
            itemAddedSale: "{quantity}x {productName} added to sale.",
            itemRemovedSale: "Item removed from sale.",
            saleEmptyWarning: "Add at least one item to finalize the sale.",
            invalidInstallments: "Invalid number of installments for installment payment.",
            saleRegisteredSuccess: "Sale registered successfully!",
            totalStockMessage: "Total Stock: {totalUnits} units. Total Stock Value: {totalValue}",
            reportSummary: "Angeli Summary:<br>Current Total Stock Value: <strong class=\"text-angeli-darkpink\">{totalStockValue}</strong><br>Total Sales Value Recorded: <strong class=\"text-angeli-darkpink\">{totalSalesValue}</strong>",
            dataExportSuccess: "Data exported successfully!",
            importConfirm: "Are you sure you want to import data? This will <strong>overwrite all your current</strong> product and sales data.",
            dataImportSuccess: "Data imported successfully! The application has been updated.",
            invalidJsonFormat: "Invalid JSON file format. Expected \"products\" and \"sales\" arrays.",
            fileReadError: "Error reading file.",
            saveDataError: "Error saving data locally.",
            loadDataError: "Error loading data locally. Data might be corrupted.",
            productNameRequired: "Product name is required.",
            colorRequired: "Color is required.",
            sizeRequired: "Size is required.",
            skuRequired: "SKU is required.",
            quantityInvalid: "Quantity must be a non-negative number.",
            priceInvalid: "Price must be a non-negative number.",
            invalidImageUrl: "Invalid image URL.",
            notInformed: "Not Informed",
            editButton: "Edit",
            deleteButton: "Delete"
        }
    };

    /**
     * Atualiza todo o texto na página com base no idioma selecionado.
     */
    function applyTranslations() {
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });

        // Placeholder texts
        searchInput.placeholder = translations[currentLanguage].searchPlaceholder;
        productName.placeholder = translations[currentLanguage].productNamePlaceholder || "Ex: Vestido Floral";
        productColor.placeholder = translations[currentLanguage].colorPlaceholder || "Ex: Vermelho";
        productSize.placeholder = translations[currentLanguage].sizePlaceholder || "Ex: P, M, G";
        productSKU.placeholder = translations[currentLanguage].skuPlaceholder || "Ex: PROD-123";
        productQuantity.placeholder = translations[currentLanguage].quantityPlaceholder || "Ex: 10";
        productPrice.placeholder = translations[currentLanguage].pricePlaceholder || "Ex: 49.90";
        productImage.placeholder = translations[currentLanguage].imageURLPlaceholder || "Ex: https://via.placeholder.com/150";
        saleQuantity.placeholder = translations[currentLanguage].saleQuantityPlaceholder || "Ex: 1";
        numInstallments.placeholder = translations[currentLanguage].numInstallmentsPlaceholder || "Ex: 3";
        customerName.placeholder = translations[currentLanguage].customerNamePlaceholder || "Ex: Ana Silva";

        // Traduzir as opções do select de pagamento
        document.querySelector('#paymentType option[value="À Vista"]').textContent = translations[currentLanguage].cash;
        document.querySelector('#paymentType option[value="Crédito"]').textContent = translations[currentLanguage].credit;
        document.querySelector('#paymentType option[value="Parcelado"]').textContent = translations[currentLanguage].installment;

        // Traduzir opções do seletor de idioma no modal
        if (modalLanguageSelector) {
            const ptOption = modalLanguageSelector.querySelector('option[value="pt"]');
            const enOption = modalLanguageSelector.querySelector('option[value="en"]');
            if (ptOption) ptOption.textContent = translations[currentLanguage].lang_pt;
            if (enOption) enOption.textContent = translations[currentLanguage].lang_en;
        }

        // Re-renderizar produtos e vendas para aplicar traduções em elementos dinâmicos
        renderProducts();
        if (!salesHistorySection.classList.contains('hidden')) {
            renderSalesHistory();
        }
        renderSaleItems(); // Para atualizar os itens da venda se o modal estiver aberto
    }


    /**
     * Exibe uma mensagem ao usuário na messageBox.
     * @param {string} messageKey - A chave da mensagem no objeto de traduções.
     * @param {string} type - Tipo da mensagem ('success', 'error', 'warning', 'info'). Controla a cor de fundo.
     * @param {object} [placeholders={}] - Objeto com pares chave-valor para substituir no texto da mensagem.
     */
    function showMessage(messageKey, type = 'info', placeholders = {}) {
        let message = translations[currentLanguage][messageKey] || messageKey; // Fallback para a chave se não houver tradução

        // Substituir placeholders
        for (const key in placeholders) {
            message = message.replace(`{${key}}`, placeholders[key]);
        }

        messageBox.innerHTML = message; // Usar innerHTML para permitir tags HTML como <strong>
        messageBox.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl opacity-0 transition-opacity duration-300 z-50';

        switch (type) {
            case 'success':
                messageBox.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                messageBox.classList.add('bg-red-600', 'text-white');
                break;
            case 'warning':
                messageBox.classList.add('bg-yellow-500', 'text-gray-900');
                break;
            case 'info':
            default:
                messageBox.classList.add('bg-gray-800', 'text-white');
                break;
        }

        messageBox.classList.add('active', 'opacity-100');
        setTimeout(() => {
            messageBox.classList.remove('opacity-100');
            messageBox.classList.add('opacity-0');
            setTimeout(() => {
                messageBox.classList.remove('active');
            }, 300); // Espera a transição de opacidade terminar
        }, 3000); // Mensagem visível por 3 segundos
    }

    /**
     * Abre um modal específico.
     * @param {HTMLElement} modalElement - O elemento do modal a ser aberto.
     */
    function openModal(modalElement) {
        modalElement.classList.add('active');
        // Adiciona um listener para fechar o modal ao clicar fora
        setTimeout(() => { // Pequeno delay para evitar clique acidental no overlay
            modalElement.addEventListener('click', closeOnOverlayClick);
        }, 50);
    }

    /**
     * Fecha um modal específico.
     * @param {HTMLElement} modalElement - O elemento do modal a ser fechado.
     */
    function closeModal(modalElement) {
        modalElement.classList.remove('active');
        modalElement.removeEventListener('click', closeOnOverlayClick);
    }

    /**
     * Fecha o modal se o clique for no overlay (fora do conteúdo).
     * @param {Event} event - O evento de clique.
     */
    function closeOnOverlayClick(event) {
        if (event.target === this) { // 'this' refere-se ao modalElement no addEventListener
            closeModal(this);
        }
    }

    /**
     * Gera um ID único baseado em timestamp e string aleatória.
     * @returns {string} ID único.
     */
    function generateUniqueId() {
        return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Formata um valor numérico para o formato de moeda brasileira (R$).
     * @param {number} value - O valor a ser formatado.
     * @returns {string} O valor formatado como R$.
     */
    function formatCurrency(value) {
        return new Intl.NumberFormat(currentLanguage === 'pt' ? 'pt-BR' : 'en-US', {
            style: 'currency',
            currency: 'BRL' // Moeda permanece BRL, apenas a formatação muda
        }).format(value);
    }

    // --- Funções de Armazenamento Local ---

    /**
     * Salva os dados no localStorage.
     */
    function saveData() {
        try {
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(allProducts));
            localStorage.setItem(SALE_STORAGE_KEY, JSON.stringify(allSales));
            localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage); // Salva o idioma
            statusMessage.textContent = translations[currentLanguage].statusSaved;
        } catch (error) {
            console.error('Erro ao salvar dados no localStorage:', error);
            showMessage('saveDataError', 'error');
        }
    }

    /**
     * Carrega os dados do localStorage.
     */
    function loadData() {
        try {
            const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
            const storedSales = localStorage.getItem(SALE_STORAGE_KEY);
            const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

            allProducts = storedProducts ? JSON.parse(storedProducts) : [];
            allSales = storedSales ? JSON.parse(storedSales) : [];
            currentLanguage = storedLanguage || 'pt'; // Define o idioma carregado ou 'pt' como padrão

            if (modalLanguageSelector) {
                modalLanguageSelector.value = currentLanguage; // Atualiza o seletor do modal
            }
            applyTranslations(); // Aplica as traduções
            statusMessage.textContent = translations[currentLanguage].statusLoaded;
            renderProducts();
            // populateSaleProductSelect(); // Será chamado dentro de applyTranslations ou após renderProducts se necessário
        } catch (error) {
            console.error('Erro ao carregar dados do localStorage:', error);
            showMessage('loadDataError', 'error');
            // Opcionalmente, limpa dados corrompidos para prevenir problemas futuros
            localStorage.removeItem(PRODUCT_STORAGE_KEY);
            localStorage.removeItem(SALE_STORAGE_KEY);
            allProducts = [];
            allSales = [];
        }
    }

    // --- Funções de Gestão de Produtos ---

    /**
     * Valida os campos do formulário de produto.
     * @param {object} product - Objeto contendo os dados do produto.
     * @returns {string|null} Chave da mensagem de erro se a validação falhar, ou null se for bem-sucedida.
     */
    function validateProductForm(product) {
        if (!product.name.trim()) return 'productNameRequired';
        if (!product.color.trim()) return 'colorRequired';
        if (!product.size.trim()) return 'sizeRequired';
        if (!product.sku.trim()) return 'skuRequired';
        if (isNaN(product.quantity) || product.quantity < 0) return 'quantityInvalid';
        if (isNaN(product.price) || product.price < 0) return 'priceInvalid';
        if (product.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(product.imageUrl)) {
            return 'invalidImageUrl';
        }
        return null;
    }

    /**
     * Renderiza a lista de produtos na interface.
     */
    function renderProducts() {
        loadingProducts.classList.add('hidden');
        productsList.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();

        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.color.toLowerCase().includes(searchTerm) ||
            product.size.toLowerCase().includes(searchTerm)
        );

        if (filteredProducts.length === 0) {
            noProductsFound.classList.remove('hidden');
        } else {
            noProductsFound.classList.add('hidden');
            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.imageUrl || 'https://via.placeholder.com/150x150?text=Sem+Imagem'}" alt="${product.name}" class="product-card-img">
                    <div class="product-card-info">
                        <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-sm text-gray-600">${translations[currentLanguage].colorLabel}: ${product.color} | ${translations[currentLanguage].sizeLabel}: ${product.size}</p>
                        <p class="text-sm text-gray-600">SKU: ${product.sku}</p>
                        <p class="text-xl font-bold text-angeli-darkpink mt-2">${translations[currentLanguage].quantityLabel}: ${product.quantity}</p>
                        <p class="text-md font-medium text-gray-700">${formatCurrency(product.price)}</p>
                    </div>
                    <div class="product-card-actions">
                        <button class="product-card-action-btn edit-product-btn" data-id="${product.id}" title="${translations[currentLanguage].editButton}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.72a.75.75 0 0 1-.942-.942l.72-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            ${translations[currentLanguage].editButton}
                        </button>
                        <button class="product-card-action-btn delete-product-btn" data-id="${product.id}" title="${translations[currentLanguage].deleteButton}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.925a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165 1.104 1.637-.659 2.115m9.462-2.115c-.141-.01-.282-.02-.423-.03M7.5 7.5c.414-.414 1.125-1.029 1.956-1.029M12 5.25v1.5m-3.956-1.029C8.385 5.293 7.5 5.584 7.5 7.5c0 1.914.885 2.204 1.956 2.204" />
                            </svg>
                            ${translations[currentLanguage].deleteButton}
                        </button>
                    </div>
                `;
                productsList.appendChild(productCard);
            });

            // Adicionar event listeners aos botões de editar e excluir
            document.querySelectorAll('.edit-product-btn').forEach(button => {
                button.addEventListener('click', (event) => editProduct(event.currentTarget.dataset.id));
            });
            document.querySelectorAll('.delete-product-btn').forEach(button => {
                button.addEventListener('click', (event) => deleteProduct(event.currentTarget.dataset.id));
            });
        }
        populateSaleProductSelect(); // Garante que a lista de produtos para venda esteja atualizada
    }

    /**
     * Abre o modal de produto para adicionar um novo produto.
     */
    function openAddProductModal() {
        productForm.reset(); // Limpa o formulário
        editingProductId = null; // Reinicia o ID de edição
        productModalTitle.textContent = translations[currentLanguage].addProductTitle;
        openModal(productModal);
    }

    /**
     * Preenche o formulário de produto com os dados do produto para edição.
     * @param {string} id - O ID do produto a ser editado.
     */
    function editProduct(id) {
        const productToEdit = allProducts.find(p => p.id === id);
        if (productToEdit) {
            editingProductId = id;
            productModalTitle.textContent = translations[currentLanguage].editProductTitle;
            productName.value = productToEdit.name;
            productColor.value = productToEdit.color;
            productSize.value = productToEdit.size;
            productSKU.value = productToEdit.sku;
            productQuantity.value = productToEdit.quantity;
            productPrice.value = productToEdit.price;
            productImage.value = productToEdit.imageUrl || '';
            openModal(productModal);
        } else {
            showMessage('productNotFoundEdit', 'error');
        }
    }

    /**
     * Lida com o envio do formulário de produto (adicionar/editar).
     * @param {Event} event - O evento de envio do formulário.
     */
    function handleProductFormSubmit(event) {
        event.preventDefault();

        const newProduct = {
            name: productName.value.trim(),
            color: productColor.value.trim(),
            size: productSize.value.trim(),
            sku: productSKU.value.trim(),
            quantity: parseInt(productQuantity.value, 10),
            price: parseFloat(productPrice.value),
            imageUrl: productImage.value.trim(),
        };

        const validationErrorKey = validateProductForm(newProduct);
        if (validationErrorKey) {
            showMessage(validationErrorKey, 'warning');
            return;
        }

        if (editingProductId) {
            // Edita produto existente
            const productIndex = allProducts.findIndex(p => p.id === editingProductId);
            if (productIndex !== -1) {
                allProducts[productIndex] = { ...allProducts[productIndex], ...newProduct };
                showMessage('productUpdatedSuccess', 'success');
            } else {
                showMessage('productNotFoundEdit', 'error'); // Caso o produto desapareça misteriosamente
            }
        } else {
            // Adiciona novo produto
            newProduct.id = generateUniqueId();
            newProduct.createdAt = Date.now();
            allProducts.push(newProduct);
            showMessage('productAddedSuccess', 'success');
        }

        saveData();
        renderProducts();
        closeModal(productModal);
    }

    /**
     * Solicita confirmação antes de excluir um produto.
     * @param {string} id - O ID do produto a ser excluído.
     */
    function deleteProduct(id) {
        const productToDelete = allProducts.find(p => p.id === id);
        if (!productToDelete) {
            showMessage('productNotFoundDelete', 'error');
            return;
        }

        confirmModalTitle.textContent = translations[currentLanguage].confirmation;
        confirmModalMessage.innerHTML = translations[currentLanguage].productDeleteConfirm.replace('{productName}', productToDelete.name);
        openModal(confirmModal);

        // Define a ação de confirmação para o botão do modal
        confirmActionBtn.onclick = () => {
            allProducts = allProducts.filter(p => p.id !== id);
            saveData();
            renderProducts();
            showMessage('productDeleteSuccess', 'success');
            closeModal(confirmModal);
        };
    }

    // --- Funções de Registro de Vendas ---

    /**
     * Preenche o dropdown de seleção de produtos no modal de venda.
     */
    function populateSaleProductSelect() {
        saleProductSelect.innerHTML = `<option value="">${translations[currentLanguage].selectOption}</option>`;
        const availableProducts = allProducts.filter(product => product.quantity > 0);

        if (availableProducts.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = translations[currentLanguage].noProducts;
            option.disabled = true;
            saleProductSelect.appendChild(option);
            addItemToSaleBtn.disabled = true;
        } else {
            availableProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (${product.sku}) - ${translations[currentLanguage].quantityLabel}: ${product.quantity}`;
                saleProductSelect.appendChild(option);
            });
            addItemToSaleBtn.disabled = false;
        }
    }

    /**
     * Abre o modal de registro de venda e reinicia seus campos.
     */
    function openRegisterSaleModal() {
        saleForm.reset();
        currentSaleItems = [];
        renderSaleItems();
        calculateTotalSaleAmount();
        paymentType.value = 'À Vista';
        installmentDetails.classList.add('hidden');
        customerName.value = '';
        populateSaleProductSelect();
        openModal(saleModal);
    }

    /**
     * Adiciona um item selecionado à lista temporária da venda.
     */
    function addItemToSale() {
        const productId = saleProductSelect.value;
        const quantity = parseInt(saleQuantity.value, 10);

        if (!productId) {
            showMessage('selectProductWarning', 'warning');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessage('quantityPositiveWarning', 'warning');
            return;
        }

        const product = allProducts.find(p => p.id === productId);
        if (!product) {
            showMessage('productNotFoundSale', 'error');
            return;
        }

        if (quantity > product.quantity) {
            showMessage('insufficientStock', 'warning', { productName: product.name, availableQuantity: product.quantity });
            return;
        }

        const existingItemIndex = currentSaleItems.findIndex(item => item.productId === productId);

        if (existingItemIndex !== -1) {
            // Se o item já existe, atualiza a quantidade
            const currentItem = currentSaleItems[existingItemIndex];
            if (currentItem.quantity + quantity > product.quantity) {
                showMessage('exceedsStock', 'warning', { quantity: quantity, productName: product.name, availableQuantity: product.quantity - currentItem.quantity });
                return;
            }
            currentItem.quantity += quantity;
            showMessage('quantityUpdatedSale', 'info', { productName: product.name });
        } else {
            // Adiciona novo item
            currentSaleItems.push({
                productId: product.id,
                name: product.name,
                sku: product.sku,
                unitPrice: product.price,
                quantity: quantity
            });
            showMessage('itemAddedSale', 'success', { quantity: quantity, productName: product.name });
        }

        renderSaleItems();
        calculateTotalSaleAmount();
    }

    /**
     * Remove um item da lista temporária da venda.
     * @param {string} productId - O ID do produto a ser removido da venda.
     */
    function removeSaleItem(productId) {
        currentSaleItems = currentSaleItems.filter(item => item.productId !== productId);
        renderSaleItems();
        calculateTotalSaleAmount();
        showMessage('itemRemovedSale', 'info');
    }

    /**
     * Renderiza os itens adicionados à venda no modal.
     */
    function renderSaleItems() {
        saleItemList.innerHTML = '';
        if (currentSaleItems.length === 0) {
            noSaleItems.classList.remove('hidden');
            noSaleItems.textContent = translations[currentLanguage].noSaleItems;
        } else {
            noSaleItems.classList.add('hidden');
            currentSaleItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex justify-between items-center bg-gray-50 p-2 rounded-md';
                itemDiv.innerHTML = `
                    <span>${item.quantity}x ${item.name} (${item.sku}) - ${formatCurrency(item.unitPrice)}/${translations[currentLanguage].unitShort || 'un'}</span>
                    <span class="font-semibold">${formatCurrency(item.quantity * item.unitPrice)}</span>
                    <button type="button" class="text-red-500 hover:text-red-700 ml-2 remove-sale-item-btn" data-product-id="${item.productId}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.925a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165 1.104 1.637-.659 2.115m9.462-2.115c-.141-.01-.282-.02-.423-.03M7.5 7.5c.414-.414 1.125-1.029 1.956-1.029M12 5.25v1.5m-3.956-1.029C8.385 5.293 7.5 5.584 7.5 7.5c0 1.914.885 2.204 1.956 2.204" />
                        </svg>
                    </button>
                `;
                saleItemList.appendChild(itemDiv);
            });

            document.querySelectorAll('.remove-sale-item-btn').forEach(button => {
                button.addEventListener('click', (event) => removeSaleItem(event.currentTarget.dataset.productId));
            });
        }
    }

    /**
     * Calcula e exibe o valor total da venda.
     */
    function calculateTotalSaleAmount() {
        const total = currentSaleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        totalSaleAmount.textContent = formatCurrency(total);

        // Atualiza o valor da parcela se o tipo de pagamento for 'Parcelado'
        if (paymentType.value === 'Parcelado' && numInstallments.value > 0) {
            const installments = parseInt(numInstallments.value, 10);
            if (!isNaN(installments) && installments > 0) {
                installmentValue.value = formatCurrency(total / installments);
            } else {
                installmentValue.value = formatCurrency(0);
            }
        }
    }

    /**
     * Lida com a finalização da venda.
     * @param {Event} event - O evento de envio do formulário.
     */
    function handleSaleFormSubmit(event) {
        event.preventDefault();

        if (currentSaleItems.length === 0) {
            showMessage('saleEmptyWarning', 'warning');
            return;
        }

        const saleTotal = currentSaleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const selectedPaymentType = paymentType.value;
        let saleInstallmentDetails = null;

        if (selectedPaymentType === 'Parcelado') {
            const installments = parseInt(numInstallments.value, 10);
            if (isNaN(installments) || installments <= 1) {
                showMessage('invalidInstallments', 'warning');
                return;
            }
            saleInstallmentDetails = {
                numInstallments: installments,
                valuePerInstallment: saleTotal / installments
            };
        }

        // Deduz as quantidades do estoque
        let stockUpdateSuccess = true;
        currentSaleItems.forEach(saleItem => {
            const productIndex = allProducts.findIndex(p => p.id === saleItem.productId);
            if (productIndex !== -1) {
                if (allProducts[productIndex].quantity >= saleItem.quantity) {
                    allProducts[productIndex].quantity -= saleItem.quantity;
                } else {
                    showMessage('insufficientStock', 'error', { productName: saleItem.name, availableQuantity: allProducts[productIndex].quantity });
                    stockUpdateSuccess = false;
                    return; // Sai do forEach se encontrar um problema
                }
            }
        });

        if (!stockUpdateSuccess) {
            return; // Interrompe se houve um problema com o estoque
        }

        // Cria o novo objeto de venda
        const newSale = {
            id: generateUniqueId(),
            timestamp: Date.now(),
            items: currentSaleItems.map(item => ({
                productId: item.productId,
                name: item.name,
                sku: item.sku,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            })),
            totalAmount: saleTotal,
            paymentType: selectedPaymentType,
            installmentDetails: saleInstallmentDetails,
            customerName: customerName.value.trim() || translations[currentLanguage].notInformed,
            status: 'completed'
        };

        allSales.unshift(newSale); // Adiciona ao início da lista para que as mais recentes apareçam primeiro

        saveData();
        renderProducts(); // Atualiza a lista de produtos para refletir as novas quantidades
        showMessage('saleRegisteredSuccess', 'success');
        closeModal(saleModal);
    }

    /**
     * Renderiza o histórico de vendas.
     */
    function renderSalesHistory() {
        loadingSales.classList.add('hidden');
        salesList.innerHTML = '';

        if (allSales.length === 0) {
            noSalesFound.classList.remove('hidden');
            noSalesFound.textContent = translations[currentLanguage].noSales;
        } else {
            noSalesFound.classList.add('hidden');
            allSales.forEach(sale => {
                const saleCard = document.createElement('div');
                saleCard.className = 'bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200';
                const saleDate = new Date(sale.timestamp).toLocaleString(currentLanguage === 'pt' ? 'pt-BR' : 'en-US');
                let installmentInfo = '';
                if (sale.paymentType === 'Parcelado' && sale.installmentDetails) {
                    installmentInfo = `(${sale.installmentDetails.numInstallments}x de ${formatCurrency(sale.installmentDetails.valuePerInstallment)})`;
                }

                saleCard.innerHTML = `
                    <p class="text-sm text-gray-500 mb-2">Venda ID: ${sale.id}</p>
                    <h4 class="text-lg font-semibold text-angeli-darkpink">${formatCurrency(sale.totalAmount)}</h4>
                    <p class="text-sm text-gray-700">${translations[currentLanguage].dateLabel || 'Data'}: ${saleDate}</p>
                    <p class="text-sm text-gray-700">${translations[currentLanguage].customerLabel || 'Cliente'}: ${sale.customerName}</p>
                    <p class="text-sm text-gray-700 mb-3">${translations[currentLanguage].paymentLabel || 'Pagamento'}: ${translations[currentLanguage][sale.paymentType.toLowerCase().replace(' ', '')] || sale.paymentType} ${installmentInfo}</p>
                    <h5 class="font-medium text-gray-700 mb-1">${translations[currentLanguage].saleItems}:</h5>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                        ${sale.items.map(item => `
                            <li>${item.quantity}x ${item.name} (${item.sku}) - ${formatCurrency(item.unitPrice)}/${translations[currentLanguage].unitShort || 'un'} = ${formatCurrency(item.quantity * item.unitPrice)}</li>
                        `).join('')}
                    </ul>
                `;
                salesList.appendChild(saleCard);
            });
        }
    }

    // --- Funções de Relatórios e Visualizações ---

    /**
     * Exibe o total de unidades em estoque e o valor total do estoque.
     */
    function showTotalStock() {
        const totalUnits = allProducts.reduce((sum, product) => sum + product.quantity, 0);
        const totalStockValue = allProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);
        showMessage('totalStockMessage', 'info', { totalUnits: totalUnits, totalValue: formatCurrency(totalStockValue) });
    }

    /**
     * Gera um resumo do estoque e das vendas.
     */
    function generateReport() {
        const totalStockValue = allProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);
        const totalSalesValue = allSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        showMessage('reportSummary', 'info', { totalStockValue: formatCurrency(totalStockValue), totalSalesValue: formatCurrency(totalSalesValue) });
    }

    // --- Funções de Backup e Restauração ---

    /**
     * Exporta os dados atuais como um arquivo JSON.
     */
    function exportData() {
        const dataToExport = {
            products: allProducts,
            sales: allSales
        };
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `angeli_data_backup_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('dataExportSuccess', 'success');
    }

    /**
     * Permite ao usuário importar dados de um arquivo JSON.
     */
    function importData() {
        importDataInput.click(); // Aciona o clique no input de arquivo escondido
    }

    /**
     * Lida com a seleção e leitura do arquivo JSON para importação.
     * @param {Event} event - O evento de mudança do input de arquivo.
     */
    function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData.products || !importedData.sales) {
                    throw new Error(translations[currentLanguage].invalidJsonFormat);
                }

                confirmModalTitle.textContent = translations[currentLanguage].confirmation;
                confirmModalMessage.innerHTML = translations[currentLanguage].importConfirm;
                openModal(confirmModal);

                confirmActionBtn.onclick = () => {
                    allProducts = importedData.products;
                    allSales = importedData.sales;
                    saveData();
                    renderProducts();
                    showMessage('dataImportSuccess', 'success');
                    closeModal(confirmModal);
                    // Reseta o input de arquivo para permitir importar o mesmo arquivo novamente se necessário
                    importDataInput.value = '';
                };
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                showMessage('fileReadError', 'error', { message: error.message });
                importDataInput.value = ''; // Reseta o input em caso de erro
            }
        };
        reader.onerror = () => {
            showMessage('fileReadError', 'error');
            importDataInput.value = ''; // Reseta o input em caso de erro
        };
        reader.readAsText(file);
    }


    // --- Inicialização e Event Listeners ---

    // Carrega os dados e o idioma ao carregar a página
    loadData();

    // --- Event Listeners Globais ---
    addProductBtn.addEventListener('click', openAddProductModal);
    registerSaleBtn.addEventListener('click', openRegisterSaleModal);
    viewSalesHistoryBtn.addEventListener('click', () => {
        productsSection.classList.add('hidden');
        salesHistorySection.classList.remove('hidden');
        renderSalesHistory();
    });
    backToProductsBtn.addEventListener('click', () => {
        salesHistorySection.classList.add('hidden');
        productsSection.classList.remove('hidden');
        renderProducts();
    });
    viewTotalStockBtn.addEventListener('click', showTotalStock);
    generateReportBtn.addEventListener('click', generateReport);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);
    importDataInput.addEventListener('change', handleFileImport);
    searchInput.addEventListener('input', renderProducts); // Pesquisa em tempo real

    // Event Listener para o seletor de idioma
    // languageSelector.addEventListener('change', (event) => {
    //     currentLanguage = event.target.value;
    //     saveData(); // Salva o novo idioma selecionado
    //     applyTranslations(); // Aplica as novas traduções
    // });

    // Abrir modal de configurações ao clicar no botão
    settingsBtn.addEventListener('click', () => {
        modalLanguageSelector.value = currentLanguage; // sincroniza valor atual
        openModal(settingsModal);
    });

    // Fechar modal de configurações
    closeSettingsBtn.addEventListener('click', () => {
        closeModal(settingsModal);
    });

    // Trocar idioma pelo seletor no modal
    modalLanguageSelector.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        saveData();
        applyTranslations();
    });

    // Event Listeners do Modal de Produto
    productForm.addEventListener('submit', handleProductFormSubmit);
    cancelProductBtn.addEventListener('click', () => closeModal(productModal));

    // Event Listeners do Modal de Venda
    addItemToSaleBtn.addEventListener('click', addItemToSale);
    saleForm.addEventListener('submit', handleSaleFormSubmit);
    cancelSaleBtn.addEventListener('click', () => closeModal(saleModal));
    paymentType.addEventListener('change', (event) => {
        if (event.target.value === 'Parcelado') {
            installmentDetails.classList.remove('hidden');
            numInstallments.setAttribute('required', 'true');
        } else {
            installmentDetails.classList.add('hidden');
            numInstallments.removeAttribute('required');
        }
        calculateTotalSaleAmount(); // Recalcula se o total mudar com o tipo de parcela
    });
    numInstallments.addEventListener('input', calculateTotalSaleAmount);


    // Event Listeners do Modal de Confirmação
    cancelConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
});