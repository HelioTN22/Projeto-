import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Button,
    SafeAreaView,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CharacterDetails = ({ navigation }) => {
    const route = useRoute();
    const { character } = route.params;

    const [name, setName] = useState(character.name);
    const [life, setLife] = useState(character.life);
    const [CA, setCA] = useState(character.CA);
    const [mana, setMana] = useState(character.mana);
    const [items, setItems] = useState(character.items);
    const [skills, setSkills] = useState(character.skills || []);
    const [isEditing, setIsEditing] = useState(false);

    const [attributes, setAttributes] = useState({
        Força: 10,
        Destreza: 10,
        Constituição: 10,
        Inteligência: 10,
        Sabedoria: 10,
        Carisma: 10,
    });

    const saveCharacterData = async () => {
        try {
            const characterData = {
                name,
                life,
                CA,
                mana,
                items,
                skills,
                attributes,
            };
            await AsyncStorage.setItem(`@character_${character.id}`, JSON.stringify(characterData));
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar os dados: ', error);
        }
    };

    const loadCharacterData = async () => {
        try {
            const savedCharacterData = await AsyncStorage.getItem(`@character_${character.id}`);
            if (savedCharacterData) {
                const parsedData = JSON.parse(savedCharacterData);
                setName(parsedData.name);
                setLife(parsedData.life);
                setCA(parsedData.CA);
                setMana(parsedData.mana);
                setItems(parsedData.items);
                setSkills(parsedData.skills);
                setAttributes(parsedData.attributes || attributes);
            }
        } catch (error) {
            console.error('Erro ao carregar os dados: ', error);
        }
    };

    useEffect(() => {
        loadCharacterData();
    }, []);

    const handleSave = () => {
        saveCharacterData();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleAttributeChange = (key, value) => {
        setAttributes({ ...attributes, [key]: value });
    };

    const handleAddSkill = () => {
        setSkills([...skills, 'Nova Perícia']);
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Detalhes do Personagem</Text>
                </View>
                <View style={styles.characterContainer}>
                    <Image source={{ uri: character.image }} style={styles.characterImage} />
                    <Text style={styles.characterName}>{name}</Text>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => alert('Personagem excluído!')}>
                    <Icon name="trash" size={30} color="red" />
                </TouchableOpacity>

                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Atributos:</Text>
                    <View style={styles.attributesGrid}>
                        {Object.keys(attributes).map((key) => (
                            <View key={key} style={styles.attributeBox}>
                                <Text style={styles.attributeName}>{key}</Text>
                                <TextInput
                                    style={styles.attributeValue}
                                    value={String(attributes[key])}
                                    onChangeText={(value) => handleAttributeChange(key, value)}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            </View>
                        ))}
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statsColumn}>
                            <Text style={styles.label}>Vida:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(life)}
                                onChangeText={setLife}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsColumn}>
                            <Text style={styles.label}>CA:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(CA)}
                                onChangeText={setCA}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsColumn}>
                            <Text style={styles.label}>Iniciativa:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(character.iniciativa || '')}
                                onChangeText={(value) => setCharacter({ ...character, iniciativa: value })}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statsColumn}>
                            <Text style={styles.label}>Mana:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(mana)}
                                onChangeText={setMana}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsColumn}>
                            <Text style={styles.label}>Deslocamento:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(character.deslocamento || '')}
                                onChangeText={(value) => setCharacter({ ...character, deslocamento: value })}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Itens:</Text>
                    <TextInput
                        style={styles.input}
                        value={items}
                        onChangeText={setItems}
                        editable={isEditing}
                    />

                    <Text style={styles.label}>Perícias:</Text>
                    {skills.map((skill, index) => (
                        <View key={index} style={styles.skillContainer}>
                            <TextInput
                                style={styles.input}
                                value={skill}
                                onChangeText={(text) => {
                                    const newSkills = [...skills];
                                    newSkills[index] = text;
                                    setSkills(newSkills);
                                }}
                                editable={isEditing}
                            />
                            {isEditing && (
                                <TouchableOpacity onPress={() => handleRemoveSkill(index)}>
                                    <Icon name="minus-circle" size={24} color="red" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {isEditing && (
                        <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                            <Icon name="plus-circle" size={24} color="green" />
                            <Text>Adicionar Perícia</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <>
                            <Button title="Salvar" onPress={handleSave} color="#4CAF50" />
                            <Button title="Cancelar" onPress={handleCancel} color="#FF5722" />
                        </>
                    ) : (
                        <Button title="Editar" onPress={() => setIsEditing(true)} color="#2196F3" />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    characterContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    characterImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    characterName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    detailsContainer: {
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    attributesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    attributeBox: {
        width: '48%',
        marginBottom: 10,
    },
    attributeName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    attributeValue: {
        borderBottomWidth: 1,
        padding: 5,
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statsColumn: {
        width: '30%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 8,
        fontSize: 16,
        borderRadius: 5,
    },
    skillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    addSkillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },

    
};

export default CharacterDetails;
