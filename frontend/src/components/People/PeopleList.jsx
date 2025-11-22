import React, { useState, useEffect } from 'react';
import { getPeople, deletePerson, getPersonSummary, createPerson, updatePerson } from '../../api/api';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import PersonForm from './PersonForm';
import { useToastContext } from '../../contexts/ToastContext';

const PeopleList = () => {
  const toast = useToastContext();
  const [people, setPeople] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const response = await getPeople();
      setPeople(response.data);
      
      // Carregar resumo de cada pessoa
      for (const person of response.data) {
        const summary = await getPersonSummary(person.id);
        setSummaries(prev => ({ ...prev, [person.id]: summary.data }));
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir esta pessoa?')) {
      try {
        await deletePerson(id);
        loadPeople();
      } catch (error) {
        alert('Erro ao excluir pessoa');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, data);
      } else {
        await createPerson(data);
      }
      setShowForm(false);
      setEditingPerson(null);
      loadPeople();
    } catch (error) {
      alert('Erro ao salvar pessoa');
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPerson(null);
  };

  const getAvatarColor = (color) => color || '#3b82f6';

  const handleGeneratePdf = async (person) => {
    setGeneratingPdf(person.id);
    try {
      const response = await fetch(`http://localhost:3001/api/pdf/person-report/${person.id}`);

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const data = await response.json();
      
      // Abrir HTML em nova janela para impressão
      const newWindow = window.open('', '_blank');
      newWindow.document.write(data.html);
      newWindow.document.close();
      
      // Aguardar carregar e abrir diálogo de impressão
      setTimeout(() => {
        newWindow.print();
      }, 500);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setGeneratingPdf(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👥 Pessoas</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Pessoa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {people.map((person) => {
          const summary = summaries[person.id] || {};
          const unpaid = summary.total_unpaid || 0;
          
          return (
            <div key={person.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: getAvatarColor(person.avatar_color) }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{person.name}</h3>
                    {person.email && (
                      <p className="text-xs text-dark-muted">{person.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(person)}
                    className="p-1 hover:bg-primary/20 text-primary rounded"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="p-1 hover:bg-danger/20 text-danger rounded"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {person.phone && (
                <p className="text-sm text-dark-muted mb-2">📞 {person.phone}</p>
              )}

              {person.notes && (
                <p className="text-sm text-dark-muted mb-2 italic">{person.notes}</p>
              )}

              {unpaid > 0 && (
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-dark-muted">Deve:</p>
                      <p className="text-lg font-bold text-warning">R$ {unpaid.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleGeneratePdf(person)}
                      disabled={generatingPdf === person.id}
                      className="flex items-center gap-1 px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all text-sm font-semibold disabled:opacity-50"
                      title="Gerar Relatório PDF"
                    >
                      <FileText size={16} />
                      {generatingPdf === person.id ? 'Gerando...' : 'PDF'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {people.length === 0 && (
          <div className="col-span-full text-center py-12 text-dark-muted">
            Nenhuma pessoa cadastrada
          </div>
        )}
      </div>

      {showForm && (
        <PersonForm
          onClose={handleCloseForm}
          onSave={handleSave}
          person={editingPerson}
        />
      )}
    </div>
  );
};

export default PeopleList;
