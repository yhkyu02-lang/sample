import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';

const CompanyForm = ({ data, setData, errors, processing, onSubmit, prefectures, isEdit = false }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [postcodeSearching, setPostcodeSearching] = useState(false);
    const [postcodeError, setPostcodeError] = useState('');

    const prefectureOptions = prefectures.map((p) => ({
        label: p.display_name,
        value: p.id,
    }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const searchPostcode = async () => {
        if (!data.postcode) return;

        setPostcodeSearching(true);
        setPostcodeError('');

        try {
            const response = await axios.get('/api/postcodes/search', {
                params: { postcode: data.postcode },
            });

            if (response.data.prefecture_id) {
                setData(currentData => ({
                    ...currentData,
                    prefecture_id: response.data.prefecture_id,
                    city: response.data.city || '',
                    local: response.data.local || '',
                }));
            } else if (response.data.city || response.data.local) {
                setData(currentData => ({
                    ...currentData,
                    city: response.data.city || '',
                    local: response.data.local || '',
                }));
            }
        } catch (error) {
            setPostcodeError(error.response?.data?.error || '郵便番号が見つかりません。');
        } finally {
            setPostcodeSearching(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid">
                {/* 名前 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="名前 *" />
                    <InputText
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full"
                        maxLength={50}
                    />
                    <InputError message={errors.name} />
                </div>

                {/* メールアドレス */}
                <div className="col-12 md:col-6">
                    <InputLabel value="メールアドレス *" />
                    <InputText
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full"
                        type="email"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* 郵便番号 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="郵便番号 *" />
                    <div className="flex gap-2">
                        <InputText
                            value={data.postcode}
                            onChange={(e) => setData('postcode', e.target.value)}
                            className="flex-grow-1"
                            maxLength={7}
                            placeholder="例: 0600000"
                        />
                        <Button
                            type="button"
                            icon="pi pi-search"
                            label="検索"
                            onClick={searchPostcode}
                            loading={postcodeSearching}
                            outlined
                        />
                    </div>
                    <InputError message={errors.postcode} />
                    {postcodeError && <p className="text-sm text-red-600">{postcodeError}</p>}
                </div>

                {/* 都道府県 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="都道府県 *" />
                    <Dropdown
                        value={data.prefecture_id}
                        options={prefectureOptions}
                        onChange={(e) => setData('prefecture_id', e.value)}
                        placeholder="都道府県を選択"
                        className="w-full"
                    />
                    <InputError message={errors.prefecture_id} />
                </div>

                {/* 市区町村 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="市区町村 *" />
                    <InputText
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full"
                        maxLength={255}
                    />
                    <InputError message={errors.city} />
                </div>

                {/* 地域名 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="地域名 *" />
                    <InputText
                        value={data.local}
                        onChange={(e) => setData('local', e.target.value)}
                        className="w-full"
                        maxLength={255}
                    />
                    <InputError message={errors.local} />
                </div>

                {/* 番地 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="番地" />
                    <InputText
                        value={data.street_address}
                        onChange={(e) => setData('street_address', e.target.value)}
                        className="w-full"
                        maxLength={255}
                    />
                    <InputError message={errors.street_address} />
                </div>

                {/* 営業時間 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="営業時間" />
                    <InputText
                        value={data.business_hour}
                        onChange={(e) => setData('business_hour', e.target.value)}
                        className="w-full"
                        maxLength={255}
                    />
                    <InputError message={errors.business_hour} />
                </div>

                {/* 定休日 */}
                <div className="col-12">
                    <InputLabel value="定休日" />
                    <InputTextarea
                        value={data.regular_holiday}
                        onChange={(e) => setData('regular_holiday', e.target.value)}
                        className="w-full"
                        rows={3}
                        maxLength={255}
                    />
                    <InputError message={errors.regular_holiday} />
                </div>

                {/* 電話番号 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="電話番号" />
                    <InputText
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full"
                    />
                    <InputError message={errors.phone} />
                </div>

                {/* FAX番号 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="FAX番号" />
                    <InputText
                        value={data.fax}
                        onChange={(e) => setData('fax', e.target.value)}
                        className="w-full"
                        maxLength={50}
                    />
                    <InputError message={errors.fax} />
                </div>

                {/* URL */}
                <div className="col-12 md:col-6">
                    <InputLabel value="URL" />
                    <InputText
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        className="w-full"
                        maxLength={255}
                    />
                    <InputError message={errors.url} />
                </div>

                {/* 許可番号 */}
                <div className="col-12 md:col-6">
                    <InputLabel value="許可番号" />
                    <InputText
                        value={data.license_number}
                        onChange={(e) => setData('license_number', e.target.value)}
                        className="w-full"
                        maxLength={50}
                    />
                    <InputError message={errors.license_number} />
                </div>

                {/* 画像 */}
                <div className="col-12">
                    <InputLabel value={isEdit ? '画像' : '画像 *'} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full"
                    />
                    <InputError message={errors.image} />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-2">
                            <img
                                src={imagePreview}
                                alt="プレビュー"
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    {/* Existing Image (Edit mode) */}
                    {isEdit && !imagePreview && data.existing_image && (
                        <div className="mt-2">
                            <p className="text-sm text-600 mb-1">現在の画像:</p>
                            <img
                                src={`/storage/${data.existing_image}`}
                                alt="現在の画像"
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    )}
                </div>

                {/* 送信 */}
                <div className="col-12">
                    <Button
                        type="submit"
                        label={isEdit ? '更新' : '作成'}
                        icon={isEdit ? 'pi pi-check' : 'pi pi-plus'}
                        loading={processing}
                        className="mt-2"
                    />
                </div>
            </div>
        </form>
    );
};

export default CompanyForm;
