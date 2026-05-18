import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/layout/layout.jsx';
import CompanyForm from './CompanyForm';

const Edit = ({ company, prefectures }) => {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: company.name || '',
        email: company.email || '',
        postcode: company.postcode || '',
        prefecture_id: company.prefecture_id || '',
        city: company.city || '',
        local: company.local || '',
        street_address: company.street_address || '',
        business_hour: company.business_hour || '',
        regular_holiday: company.regular_holiday || '',
        phone: company.phone || '',
        fax: company.fax || '',
        url: company.url || '',
        license_number: company.license_number || '',
        image: null,
        existing_image: company.image || '',
    });

    const handleSubmit = () => {
        post(route('companies.update', company.id), {
            forceFormData: true,
        });
    };

    return (
        <Layout>
            <Head title="会社編集" />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>会社編集</h5>
                        <CompanyForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={handleSubmit}
                            prefectures={prefectures}
                            isEdit={true}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Edit;
