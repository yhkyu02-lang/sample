import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/layout/layout.jsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

const Index = ({ companies, filters }) => {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('companies.index'), { search }, { preserveState: true });
    };

    const confirmDelete = (company) => {
        setSelectedCompany(company);
        setDeleteDialog(true);
    };

    const handleDelete = () => {
        router.delete(route('companies.destroy', selectedCompany.id), {
            onSuccess: () => setDeleteDialog(false),
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Link href={route('companies.edit', rowData.id)}>
                    <Button icon="pi pi-pencil" rounded text severity="info" />
                </Link>
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                />
            </div>
        );
    };

    const prefectureBodyTemplate = (rowData) => {
        return rowData.prefecture?.display_name || '';
    };

    const imageBodyTemplate = (rowData) => {
        return rowData.image ? (
            <img
                src={`/storage/${rowData.image}`}
                alt={rowData.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
            />
        ) : null;
    };

    const paginationLinks = companies.links;

    return (
        <Layout>
            <Head title="会社一覧" />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-4">
                            <h5 className="m-0">会社一覧</h5>
                            <Link href={route('companies.create')}>
                                <Button label="新規作成" icon="pi pi-plus" />
                            </Link>
                        </div>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <InputText
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="名前、メール、電話番号で検索..."
                                className="w-full"
                            />
                            <Button type="submit" icon="pi pi-search" label="検索" />
                        </form>

                        <DataTable value={companies.data} responsiveLayout="scroll" emptyMessage="結果は見つかりませんでした">
                            <Column field="id" header="ID" sortable style={{ width: '5%' }} />
                            <Column header="画像" body={imageBodyTemplate} style={{ width: '8%' }} />
                            <Column field="name" header="名前" sortable />
                            <Column field="email" header="メール" sortable />
                            <Column field="postcode" header="郵便番号" />
                            <Column header="都道府県" body={prefectureBodyTemplate} />
                            <Column field="phone" header="電話番号" />
                            <Column header="操作" body={actionBodyTemplate} style={{ width: '10%' }} />
                        </DataTable>

                        {/* Pagination */}
                        <div className="flex justify-content-center mt-4 gap-1">
                            {paginationLinks.map((link, index) => (
                                <Button
                                    key={index}
                                    label={link.label.replace('&laquo; Previous', '\u00AB 前へ').replace('Next &raquo;', '次へ \u00BB').replace('&laquo;', '\u00AB').replace('&raquo;', '\u00BB')}
                                    className={link.active ? '' : 'p-button-outlined'}
                                    disabled={!link.url}
                                    size="small"
                                    onClick={() => link.url && router.get(link.url)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                visible={deleteDialog}
                style={{ width: '450px' }}
                header="確認"
                modal
                onHide={() => setDeleteDialog(false)}
                footer={
                    <div>
                        <Button label="いいえ" icon="pi pi-times" outlined onClick={() => setDeleteDialog(false)} />
                        <Button label="はい" icon="pi pi-check" severity="danger" onClick={handleDelete} />
                    </div>
                }
            >
                <div className="flex align-items-center gap-3">
                    <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
                    <span><b>{selectedCompany?.name}</b> を削除してもよろしいですか？</span>
                </div>
            </Dialog>
        </Layout>
    );
};

export default Index;
