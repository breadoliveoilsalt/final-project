class ArtObject < ApplicationRecord

    # Re: Validations: See "client/src/actions/harvardApiThunks" for which keys get auto-filled
    # on the client-side.
    # The way those auto-fills and other checks on the client side (like primaryimageurl) work
    # is the main reason for the list of these validations.
      # Remember that because the :favorite key comes from the client as "false", that cannot be validated.
  validates :primaryImageUrl, :title, :artist, :artistApiId, :firstViewed, :lastViewed, presence: true

  def self.get_title(id)
    self.find_by(id: id).title
  end

  def self.custom_new(art_object_params)
    art_object = self.new
    art_object.objectApiId = art_object_params[:objectApiId]
    art_object.primaryImageUrl = art_object_params[:primaryImageUrl]
    art_object.title = art_object_params[:title]
    art_object.artist = art_object_params[:artist]
    art_object.artistApiId = art_object_params[:artistApiId]
    art_object.medium = art_object_params[:medium]
    art_object.dated = art_object_params[:dated]
    art_object.century = art_object_params[:century]
    art_object.culture = art_object_params[:culture]
    art_object.labelText = art_object_params[:labelText]
    art_object.description = art_object_params[:description]
    art_object.commentary = art_object_params[:commentary]
    art_object.firstViewed = DateTime.parse(art_object_params[:firstViewed])
    art_object.lastViewed = DateTime.parse(art_object_params[:lastViewed])
    art_object.favorite = art_object_params[:favorite]
    art_object
  end

  def self.find_and_update_lastViewed(objectApiId)
    art_object = self.find_by(objectApiId: objectApiId)
    if !art_object
      return nil
    else
      art_object.lastViewed = DateTime.now
      art_object.save
      art_object
    end
  end

  def self.records_from_last_30_days
    self.where(:lastViewed => (DateTime.now - 30.day)..DateTime.now).order(lastViewed: :desc)
  end

  def self.favorites
    self.where(favorite: true).order(lastViewed: :desc)
  end

end
