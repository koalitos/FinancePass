const ExpenseModel = require('../models/expenseModel');
const IncomeModel = require('../models/incomeModel');
const { db } = require('../utils/database');

exports.exportMonthlyReport = (req, res) => {
  const { year, month } = req.params;
  
  ExpenseModel.getByMonth(year, month, (err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });
    
    IncomeModel.getByMonth(year, month, (incomeErr, incomes) => {
      if (incomeErr) return res.status(500).json({ error: incomeErr.message });
      
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
      const balance = totalIncomes - totalExpenses;
      
      // Agrupar despesas por categoria
      const expensesByCategory = {};
      expenses.forEach(exp => {
        const category = exp.category_name || 'Sem categoria';
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = {
            total: 0,
            items: [],
            color: exp.category_color || '#6b7280'
          };
        }
        expensesByCategory[category].total += exp.amount;
        expensesByCategory[category].items.push(exp);
      });
      
      // Criar HTML para o PDF
      const html = generateReportHTML(year, month, expenses, incomes, expensesByCategory, totalExpenses, totalIncomes, balance);
      
      res.json({
        html,
        year,
        month,
        totalExpenses,
        totalIncomes,
        balance,
        expenses,
        incomes,
        expensesByCategory
      });
    });
  });
};

function generateReportHTML(year, month, expenses, incomes, expensesByCategory, totalExpenses, totalIncomes, balance) {
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório Financeiro - ${monthNames[month - 1]} ${year}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
    h2 { color: #4b5563; margin-top: 30px; }
    .summary { display: flex; justify-content: space-between; margin: 20px 0; }
    .summary-card { padding: 20px; border-radius: 8px; flex: 1; margin: 0 10px; text-align: center; }
    .income-card { background: #d1fae5; border: 2px solid #10b981; }
    .expense-card { background: #fee2e2; border: 2px solid #ef4444; }
    .balance-card { background: #dbeafe; border: 2px solid #3b82f6; }
    .summary-card h3 { margin: 0; font-size: 14px; color: #6b7280; }
    .summary-card p { margin: 10px 0 0 0; font-size: 28px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    .category-section { margin: 30px 0; }
    .category-header { padding: 10px; border-radius: 5px; margin-bottom: 10px; }
    .footer { margin-top: 50px; text-align: center; color: #9ca3af; font-size: 12px; }
    .positive { color: #10b981; }
    .negative { color: #ef4444; }
  </style>
</head>
<body>
  <h1>Relatório Financeiro - ${monthNames[month - 1]} ${year}</h1>
  
  <div class="summary">
    <div class="summary-card income-card">
      <h3>Receitas</h3>
      <p>R$ ${totalIncomes.toFixed(2)}</p>
    </div>
    <div class="summary-card expense-card">
      <h3>Despesas</h3>
      <p>R$ ${totalExpenses.toFixed(2)}</p>
    </div>
    <div class="summary-card balance-card">
      <h3>Saldo</h3>
      <p class="${balance >= 0 ? 'positive' : 'negative'}">R$ ${balance.toFixed(2)}</p>
    </div>
  </div>
  
  <h2>Despesas por Categoria</h2>
  ${Object.entries(expensesByCategory).map(([category, data]) => `
    <div class="category-section">
      <div class="category-header" style="background: ${data.color}20; border-left: 4px solid ${data.color};">
        <strong>${category}</strong> - R$ ${data.total.toFixed(2)}
      </div>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Método</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${new Date(item.date).toLocaleDateString('pt-BR')}</td>
              <td>${item.description}</td>
              <td>R$ ${item.amount.toFixed(2)}</td>
              <td>${item.payment_method || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}
  
  ${incomes.length > 0 ? `
    <h2>Receitas</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Fonte</th>
        </tr>
      </thead>
      <tbody>
        ${incomes.map(income => `
          <tr>
            <td>${new Date(income.date).toLocaleDateString('pt-BR')}</td>
            <td>${income.description}</td>
            <td>R$ ${income.amount.toFixed(2)}</td>
            <td>${income.source || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}
  
  <div class="footer">
    <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
  </div>
</body>
</html>
  `;
}

exports.exportPersonReport = (req, res) => {
  const { personId } = req.params;
  
  // Buscar informações da pessoa
  db.get('SELECT * FROM people WHERE id = ?', [personId], (err, person) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!person) return res.status(404).json({ error: 'Pessoa não encontrada' });
    
    // Buscar dívidas da pessoa
    db.all(`
      SELECT d.*, 
        CASE 
          WHEN d.type = 'owes_me' THEN 'Me deve'
          ELSE 'Eu devo'
        END as type_label
      FROM debts d
      WHERE d.person_id = ?
      ORDER BY d.created_at DESC
    `, [personId], (debtErr, debts) => {
      if (debtErr) return res.status(500).json({ error: debtErr.message });
      
      // Buscar despesas relacionadas à pessoa
      db.all(`
        SELECT e.*, c.name as category_name, c.color as category_color
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.person_id = ?
        ORDER BY e.date DESC
      `, [personId], (expErr, expenses) => {
        if (expErr) return res.status(500).json({ error: expErr.message });
        
        // Calcular totais
        const totalOwesMe = debts
          .filter(d => d.type === 'owes_me')
          .reduce((sum, d) => sum + (d.total_amount - d.paid_amount), 0);
        
        const totalIOwe = debts
          .filter(d => d.type === 'i_owe')
          .reduce((sum, d) => sum + (d.total_amount - d.paid_amount), 0);
        
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        const html = generatePersonReportHTML(person, debts, expenses, totalOwesMe, totalIOwe, totalExpenses);
        
        res.json({
          html,
          person,
          debts,
          expenses,
          totalOwesMe,
          totalIOwe,
          totalExpenses
        });
      });
    });
  });
};

function generatePersonReportHTML(person, debts, expenses, totalOwesMe, totalIOwe, totalExpenses) {
  const owesMe = debts.filter(d => d.type === 'owes_me');
  const iOwe = debts.filter(d => d.type === 'i_owe');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório - ${person.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; margin-bottom: 40px; }
    .avatar { 
      width: 100px; 
      height: 100px; 
      border-radius: 50%; 
      background: ${person.avatar_color || '#3b82f6'}; 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 48px; 
      font-weight: bold; 
      margin: 0 auto 20px;
    }
    h1 { color: #1e40af; margin: 10px 0; }
    .contact-info { color: #6b7280; font-size: 14px; }
    .summary { display: flex; justify-content: space-around; margin: 30px 0; }
    .summary-card { 
      padding: 20px; 
      border-radius: 8px; 
      text-align: center; 
      min-width: 200px;
    }
    .owes-me-card { background: #d1fae5; border: 2px solid #10b981; }
    .i-owe-card { background: #fee2e2; border: 2px solid #ef4444; }
    .expenses-card { background: #fef3c7; border: 2px solid #f59e0b; }
    .summary-card h3 { margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; }
    .summary-card p { margin: 10px 0 0 0; font-size: 32px; font-weight: bold; }
    .section { margin: 40px 0; }
    .section-title { 
      font-size: 20px; 
      font-weight: bold; 
      color: #1e40af; 
      border-bottom: 2px solid #1e40af; 
      padding-bottom: 10px; 
      margin-bottom: 20px;
    }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db; font-size: 14px; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .debt-item { 
      background: #f9fafb; 
      padding: 15px; 
      border-radius: 8px; 
      margin-bottom: 15px;
      border-left: 4px solid #3b82f6;
    }
    .debt-item.owes-me { border-left-color: #10b981; }
    .debt-item.i-owe { border-left-color: #ef4444; }
    .debt-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .debt-description { font-weight: bold; font-size: 16px; }
    .debt-amount { font-size: 20px; font-weight: bold; }
    .debt-amount.owes-me { color: #10b981; }
    .debt-amount.i-owe { color: #ef4444; }
    .debt-details { font-size: 12px; color: #6b7280; margin-top: 5px; }
    .progress-bar { 
      background: #e5e7eb; 
      height: 8px; 
      border-radius: 4px; 
      overflow: hidden; 
      margin-top: 10px;
    }
    .progress-fill { 
      height: 100%; 
      background: #10b981; 
      transition: width 0.3s;
    }
    .footer { 
      margin-top: 50px; 
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center; 
      color: #9ca3af; 
      font-size: 12px; 
    }
    .no-data { 
      text-align: center; 
      padding: 40px; 
      color: #9ca3af; 
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">${person.name.charAt(0).toUpperCase()}</div>
    <h1>${person.name}</h1>
    <div class="contact-info">
      ${person.relationship ? `<p>${person.relationship}</p>` : ''}
      ${person.phone ? `<p>📞 ${person.phone}</p>` : ''}
      ${person.email ? `<p>📧 ${person.email}</p>` : ''}
    </div>
  </div>
  
  <div class="summary">
    <div class="summary-card owes-me-card">
      <h3>Me Deve</h3>
      <p>R$ ${totalOwesMe.toFixed(2)}</p>
    </div>
    <div class="summary-card i-owe-card">
      <h3>Eu Devo</h3>
      <p>R$ ${totalIOwe.toFixed(2)}</p>
    </div>
    ${totalExpenses > 0 ? `
    <div class="summary-card expenses-card">
      <h3>Despesas</h3>
      <p>R$ ${totalExpenses.toFixed(2)}</p>
    </div>
    ` : ''}
  </div>
  
  ${owesMe.length > 0 ? `
  <div class="section">
    <div class="section-title">💰 Valores a Receber</div>
    ${owesMe.map(debt => {
      const remaining = debt.total_amount - debt.paid_amount;
      const progress = (debt.paid_amount / debt.total_amount) * 100;
      return `
        <div class="debt-item owes-me">
          <div class="debt-header">
            <div class="debt-description">${debt.description}</div>
            <div class="debt-amount owes-me">R$ ${remaining.toFixed(2)}</div>
          </div>
          <div class="debt-details">
            Total: R$ ${debt.total_amount.toFixed(2)} | 
            Pago: R$ ${debt.paid_amount.toFixed(2)} | 
            ${debt.due_date ? `Vencimento: ${new Date(debt.due_date).toLocaleDateString('pt-BR')}` : 'Sem vencimento'}
          </div>
          ${debt.paid_amount > 0 ? `
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          ` : ''}
          ${debt.notes ? `<div class="debt-details" style="margin-top: 10px;">Obs: ${debt.notes}</div>` : ''}
        </div>
      `;
    }).join('')}
  </div>
  ` : ''}
  
  ${iOwe.length > 0 ? `
  <div class="section">
    <div class="section-title">💳 Valores a Pagar</div>
    ${iOwe.map(debt => {
      const remaining = debt.total_amount - debt.paid_amount;
      const progress = (debt.paid_amount / debt.total_amount) * 100;
      return `
        <div class="debt-item i-owe">
          <div class="debt-header">
            <div class="debt-description">${debt.description}</div>
            <div class="debt-amount i-owe">R$ ${remaining.toFixed(2)}</div>
          </div>
          <div class="debt-details">
            Total: R$ ${debt.total_amount.toFixed(2)} | 
            Pago: R$ ${debt.paid_amount.toFixed(2)} | 
            ${debt.due_date ? `Vencimento: ${new Date(debt.due_date).toLocaleDateString('pt-BR')}` : 'Sem vencimento'}
          </div>
          ${debt.paid_amount > 0 ? `
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%; background: #ef4444;"></div>
            </div>
          ` : ''}
          ${debt.notes ? `<div class="debt-details" style="margin-top: 10px;">Obs: ${debt.notes}</div>` : ''}
        </div>
      `;
    }).join('')}
  </div>
  ` : ''}
  
  ${expenses.length > 0 ? `
  <div class="section">
    <div class="section-title">📊 Despesas Relacionadas</div>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Valor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${expenses.map(exp => `
          <tr>
            <td>${new Date(exp.date).toLocaleDateString('pt-BR')}</td>
            <td>${exp.description}</td>
            <td>${exp.category_name || '-'}</td>
            <td>R$ ${exp.amount.toFixed(2)}</td>
            <td>${exp.is_paid_back ? '✓ Reembolsado' : 'Pendente'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${debts.length === 0 && expenses.length === 0 ? `
    <div class="no-data">
      <p>Nenhuma transação financeira registrada com esta pessoa.</p>
    </div>
  ` : ''}
  
  <div class="footer">
    <p><strong>Relatório Financeiro - ${person.name}</strong></p>
    <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
  </div>
</body>
</html>
  `;
}
